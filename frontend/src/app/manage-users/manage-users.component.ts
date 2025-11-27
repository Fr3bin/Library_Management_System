import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementService } from '../services/user-management.service';
import { MemberDetails } from '../models/user-management.models';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  private userManagementService = inject(UserManagementService);

  members = this.userManagementService.getAllMembers();
  searchQuery = signal('');
  showDetailsModal = signal(false);
  selectedMemberDetails = signal<MemberDetails | null>(null);
  isLoading = signal(false);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    console.log('[ManageUsers] Loading users...');
    this.isLoading.set(true);
    this.userManagementService.loadUsersFromAPI().subscribe({
      next: (response) => {
        console.log('[ManageUsers] Users loaded successfully');
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('[ManageUsers] Error loading users:', error);
        this.isLoading.set(false);
      }
    });
  }

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
    console.log('[ManageUsers] Loading details for member:', memberId);
    this.userManagementService.getMemberDetails(memberId).subscribe({
      next: (details) => {
        if (details) {
          console.log('[ManageUsers] Member details loaded:', details);
          this.selectedMemberDetails.set(details);
          this.showDetailsModal.set(true);
        }
      },
      error: (error) => {
        console.error('[ManageUsers] Error loading member details:', error);
      }
    });
  }

  closeDetailsModal() {
    this.showDetailsModal.set(false);
    this.selectedMemberDetails.set(null);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
