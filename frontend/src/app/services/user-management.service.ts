import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, forkJoin } from 'rxjs';
import { LibraryMember, MemberDetails, BorrowingRecord } from '../models/user-management.models';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

interface UserResponse {
  success: boolean;
  users?: any[];
  count?: number;
  message?: string;
}

interface LoanResponse {
  success: boolean;
  loans?: any[];
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;
  
  private membersData = signal<LibraryMember[]>([]);

  getAllMembers() {
    return this.membersData.asReadonly();
  }

  loadUsersFromAPI(): Observable<UserResponse> {
    console.log('[UserManagement] Loading users from API...');
    return this.http.get<UserResponse>(
      `${this.apiUrl}/auth/users`,
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      tap(async response => {
        console.log('[UserManagement] Users response:', response);
        if (response.success && response.users) {
          // Get all loans to calculate statistics for each user
          this.http.get<LoanResponse>(
            `${this.apiUrl}/loans/all`,
            { headers: this.authService.getAuthHeaders() }
          ).subscribe(loansResponse => {
            console.log('[UserManagement] Loans response:', loansResponse);
            const allLoans = loansResponse.loans || [];
            
            // Map users to LibraryMember format with loan statistics
            const members: LibraryMember[] = response.users!
              .filter(user => user.role === 'student' || user.role === 'member')
              .map(user => {
                const userLoans = allLoans.filter(loan => loan.userId === user._id);
                const activeLoans = userLoans.filter(loan => loan.status === 'active' || loan.status === 'overdue');
                const overdueLoans = userLoans.filter(loan => loan.status === 'overdue');
                
                return {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  memberSince: new Date(user.createdAt),
                  currentlyBorrowed: activeLoans.length,
                  totalBorrowed: userLoans.length,
                  overdue: overdueLoans.length,
                  status: user.status === 'active' ? 'Active' : 'Inactive'
                };
              });
            
            console.log('[UserManagement] Processed members:', members);
            this.membersData.set(members);
          });
        }
      }),
      catchError(error => {
        console.error('[UserManagement] Error loading users:', error);
        return of({ success: false, message: 'Failed to load users' });
      })
    );
  }

  getMemberDetails(memberId: string): Observable<MemberDetails | null> {
    const member = this.membersData().find(m => m.id === memberId);
    if (!member) return of(null);

    // Fetch user's loan history from API
    return this.http.get<LoanResponse>(
      `${this.apiUrl}/loans/user/${memberId}`,
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('[UserManagement] Member loans:', response)),
      tap(response => {
        if (response.success && response.loans) {
          const borrowingHistory: BorrowingRecord[] = response.loans.map(loan => ({
            bookId: loan.bookId,
            borrowDate: new Date(loan.borrowDate),
            dueDate: new Date(loan.dueDate),
            returnDate: loan.returnDate ? new Date(loan.returnDate) : null,
            status: this.mapLoanStatus(loan.status)
          }));

          const returned = borrowingHistory.filter(record => record.status === 'Returned').length;

          const details: MemberDetails = {
            ...member,
            borrowingHistory,
            returned
          };
          
          return details;
        }
        return null;
      }),
      catchError(error => {
        console.error('[UserManagement] Error loading member details:', error);
        return of(null);
      })
    ) as Observable<MemberDetails | null>;
  }

  private mapLoanStatus(apiStatus: string): 'Borrowed' | 'Returned' | 'Overdue' {
    switch(apiStatus) {
      case 'active': return 'Borrowed';
      case 'returned': return 'Returned';
      case 'overdue': return 'Overdue';
      default: return 'Borrowed';
    }
  }

  viewMemberDetails(memberId: string) {
    const member = this.membersData().find(m => m.id === memberId);
    console.log('View details for:', member);
  }
}
