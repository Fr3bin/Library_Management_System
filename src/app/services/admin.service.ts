import { Injectable, signal } from '@angular/core';
import { AdminStats, LibraryOverview, QuickAction, Alert } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminStatsData = signal<AdminStats>({
    totalBooks: 19,
    activeUsers: 2,
    booksBorrowed: 6,
    overdueBooks: 1
  });

  private libraryOverviewData = signal<LibraryOverview>({
    availableBooks: 13,
    totalBooks: 19,
    activeBorrowers: 1,
    totalMembers: 2
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
}
