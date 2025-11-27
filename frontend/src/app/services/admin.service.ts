import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { AdminStats, LibraryOverview, QuickAction, Alert } from '../models/admin.models';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

interface StatsResponse {
  success: boolean;
  stats?: {
    totalBooks: number;
    availableBooks: number;
    activeUsers: number;
    booksBorrowed: number;
    overdueBooks: number;
    activeBorrowers: number;
    totalMembers: number;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/admin`;
  
  private adminStatsData = signal<AdminStats>({
    totalBooks: 0,
    activeUsers: 0,
    booksBorrowed: 0,
    overdueBooks: 0
  });

  private libraryOverviewData = signal<LibraryOverview>({
    availableBooks: 0,
    totalBooks: 0,
    activeBorrowers: 0,
    totalMembers: 0
  });

  private quickActionsData = signal<QuickAction[]>([
    {
      icon: 'book',
      title: 'Add New Book',
      description: 'Expand your collection',
      route: '/admin/add-book'
    },
    {
      icon: 'users',
      title: 'Manage Users',
      description: 'View member accounts',
      route: '/admin/manage-users'
    }
  ]);

  private alertsData = signal<Alert[]>([
    {
      type: 'warning',
      title: 'Attention Required',
      message: 'There are overdue books that need follow-up',
      details: '1 book is currently overdue. Consider reaching out to borrowers to arrange returns.'
    }
  ]);

  getAdminStats() {
    return this.adminStatsData.asReadonly();
  }

  getLibraryOverview() {
    return this.libraryOverviewData.asReadonly();
  }

  getQuickActions() {
    return this.quickActionsData.asReadonly();
  }

  getAlerts() {
    return this.alertsData.asReadonly();
  }

  loadAdminStats(): Observable<StatsResponse> {
    console.log('[AdminService] Loading stats from API...');
    return this.http.get<StatsResponse>(`${this.apiUrl}/stats`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(response => {
        console.log('[AdminService] Stats response:', response);
        if (response.success && response.stats) {
          this.adminStatsData.set(response.stats);
          
          // Update library overview with accurate stats from API
          this.libraryOverviewData.set({
            totalBooks: response.stats.totalBooks,
            availableBooks: response.stats.availableBooks || (response.stats.totalBooks - response.stats.booksBorrowed),
            activeBorrowers: response.stats.activeBorrowers || 0,
            totalMembers: response.stats.totalMembers || response.stats.activeUsers
          });

          console.log('[AdminService] Updated stats:', {
            adminStats: this.adminStatsData(),
            overview: this.libraryOverviewData()
          });

          // Update alerts based on overdue books
          if (response.stats.overdueBooks > 0) {
            this.alertsData.set([{
              type: 'warning',
              title: 'Attention Required',
              message: `There are ${response.stats.overdueBooks} overdue book(s) that need follow-up`,
              details: 'Consider reaching out to borrowers to arrange returns.'
            }]);
          } else {
            this.alertsData.set([]);
          }
        }
      }),
      catchError(error => {
        console.error('Error loading admin stats:', error);
        return of({ success: false, message: 'Failed to load stats' });
      })
    );
  }
}
