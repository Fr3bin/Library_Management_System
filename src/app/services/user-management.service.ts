import { Injectable, signal } from '@angular/core';
import { LibraryMember, MemberDetails, BorrowingRecord } from '../models/user-management.models';

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
      currentlyBorrowed: 1,
      totalBorrowed: 2,
      overdue: 1,
      status: 'Active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      memberSince: new Date('2024-01-12'),
      currentlyBorrowed: 0,
      totalBorrowed: 1,
      overdue: 0,
      status: 'Active'
    }
  ]);

  // Mock borrowing history data
  private borrowingHistoryData: { [memberId: string]: BorrowingRecord[] } = {
    '1': [
      {
        bookId: '1',
        borrowDate: new Date('2024-01-25'),
        dueDate: new Date('2024-02-08'),
        returnDate: null,
        status: 'Overdue'
      },
      {
        bookId: '3',
        borrowDate: new Date('2024-01-15'),
        dueDate: new Date('2024-01-29'),
        returnDate: new Date('2024-01-28'),
        status: 'Returned'
      }
    ],
    '2': [
      {
        bookId: '2',
        borrowDate: new Date('2024-01-18'),
        dueDate: new Date('2024-02-01'),
        returnDate: new Date('2024-01-30'),
        status: 'Returned'
      }
    ]
  };

  getAllMembers() {
    return this.membersData.asReadonly();
  }

  getMemberDetails(memberId: string): MemberDetails | null {
    const member = this.membersData().find(m => m.id === memberId);
    if (!member) return null;

    const borrowingHistory = this.borrowingHistoryData[memberId] || [];
    const returned = borrowingHistory.filter(record => record.status === 'Returned').length;

    return {
      ...member,
      borrowingHistory,
      returned
    };
  }

  viewMemberDetails(memberId: string) {
    const member = this.membersData().find(m => m.id === memberId);
    console.log('View details for:', member);
    // TODO: Implement view details modal/page
  }
}
