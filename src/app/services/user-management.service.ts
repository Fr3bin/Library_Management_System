import { Injectable, signal } from '@angular/core';
import { LibraryMember } from '../models/user-management.models';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private membersData = signal<LibraryMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      memberSince: new Date('2024-01-10'),
      currentlyBorrowed: 0,
      totalBorrowed: 2,
      overdue: 0,
      status: 'Active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      memberSince: new Date('2024-01-12'),
      currentlyBorrowed: 1,
      totalBorrowed: 1,
      overdue: 1,
      status: 'Active'
    }
  ]);

  getAllMembers() {
    return this.membersData.asReadonly();
  }

  viewMemberDetails(memberId: string) {
    const member = this.membersData().find(m => m.id === memberId);
    console.log('View details for:', member);
    // TODO: Implement view details modal/page
  }
}
