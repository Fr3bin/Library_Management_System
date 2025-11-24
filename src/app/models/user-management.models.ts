export interface LibraryMember {
  id: string;
  name: string;
  email: string;
  memberSince: Date;
  currentlyBorrowed: number;
  totalBorrowed: number;
  overdue: number;
  status: 'Active' | 'Inactive';
}

export interface BorrowingRecord {
  bookId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: 'Overdue' | 'Returned' | 'Borrowed';
}

export interface MemberDetails extends LibraryMember {
  borrowingHistory: BorrowingRecord[];
  returned: number;
}
