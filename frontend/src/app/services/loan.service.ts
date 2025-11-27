import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

interface LoanResponse {
  success: boolean;
  loan?: any;
  loans?: any[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/loans`;
  private currentLoans = signal<any[]>([]);
  private loanHistory = signal<any[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  borrowBook(bookId: string): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(
      `${this.apiUrl}/borrow`,
      { bookId },
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.getMyCurrentLoans().subscribe();
        }
      }),
      catchError(error => {
        console.error('Error borrowing book:', error);
        return of({ 
          success: false, 
          message: error.error?.message || 'Failed to borrow book' 
        });
      })
    );
  }

  returnBook(loanId: string): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(
      `${this.apiUrl}/${loanId}/return`,
      {},
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.getMyCurrentLoans().subscribe();
          this.getLoanHistory().subscribe();
        }
      }),
      catchError(error => {
        console.error('Error returning book:', error);
        return of({ 
          success: false, 
          message: error.error?.message || 'Failed to return book' 
        });
      })
    );
  }

  renewLoan(loanId: string): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(
      `${this.apiUrl}/${loanId}/renew`,
      {},
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.getMyCurrentLoans().subscribe();
        }
      }),
      catchError(error => {
        console.error('Error renewing loan:', error);
        return of({ 
          success: false, 
          message: error.error?.message || 'Failed to renew loan' 
        });
      })
    );
  }

  getMyCurrentLoans(): Observable<LoanResponse> {
    return this.http.get<LoanResponse>(
      `${this.apiUrl}/my-loans`,
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.loans) {
          this.currentLoans.set(response.loans);
        }
      }),
      catchError(error => {
        console.error('Error fetching current loans:', error);
        return of({ success: false, message: 'Failed to fetch loans' });
      })
    );
  }

  getLoanHistory(): Observable<LoanResponse> {
    console.log('[Loan Service] Fetching loan history from:', `${this.apiUrl}/history`);
    return this.http.get<LoanResponse>(
      `${this.apiUrl}/history`,
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log('[Loan Service] getLoanHistory raw response:', response);
        if (response.success && response.loans) {
          console.log('[Loan Service] Setting loanHistory signal with', response.loans.length, 'loans');
          console.log('[Loan Service] Loan details:', response.loans);
          this.loanHistory.set(response.loans);
          console.log('[Loan Service] Signal value after set:', this.loanHistory());
        } else {
          console.warn('[Loan Service] Invalid response:', response);
        }
      }),
      catchError(error => {
        console.error('[Loan Service] Error fetching loan history:', error);
        return of({ success: false, message: 'Failed to fetch history' });
      })
    );
  }

  getAllLoans(): Observable<LoanResponse> {
    return this.http.get<LoanResponse>(
      this.apiUrl,
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error fetching all loans:', error);
        return of({ success: false, message: 'Failed to fetch all loans' });
      })
    );
  }

  getOverdueLoans(): Observable<LoanResponse> {
    return this.http.get<LoanResponse>(
      `${this.apiUrl}/overdue`,
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error fetching overdue loans:', error);
        return of({ success: false, message: 'Failed to fetch overdue loans' });
      })
    );
  }

  getCurrentLoansSignal() {
    return this.currentLoans.asReadonly();
  }

  getLoanHistorySignal() {
    return this.loanHistory.asReadonly();
  }
}
