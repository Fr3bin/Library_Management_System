import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { ManageBooksComponent } from '../manage-books/manage-books.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ManageBooksComponent, ManageUsersComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);

  stats = this.adminService.getAdminStats();
  overview = this.adminService.getLibraryOverview();
  quickActions = this.adminService.getQuickActions();
  alerts = this.adminService.getAlerts();

  activeTab = 'overview';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  logout() {
    // Navigate back to the login page
    this.router.navigate(['/']);
  }

  handleQuickAction(action: any) {
    console.log('Quick action clicked:', action.title);
    if (action.title === 'Add New Book') {
      this.setActiveTab('manage-books');
      // Trigger the add book modal after a brief delay to ensure tab switch
      setTimeout(() => {
        const event = new CustomEvent('openAddBookModal');
        window.dispatchEvent(event);
      }, 100);
    } else if (action.title === 'Manage Users') {
      this.setActiveTab('manage-users');
    }
  }
}
