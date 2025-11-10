import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementService } from '../services/user-management.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent {
  private userManagementService = inject(UserManagementService);

  members = this.userManagementService.getAllMembers();
  searchQuery = signal('');

  filteredMembers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    
    return this.members().filter(member => {
      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
      );
    });
  });

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  viewDetails(memberId: string) {
    this.userManagementService.viewMemberDetails(memberId);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
