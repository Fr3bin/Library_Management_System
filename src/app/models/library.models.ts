export interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  dueDate: Date;
  borrowedDate: Date;
}

export interface MemberStats {
  currentlyBorrowed: number;
  totalBorrowed: number;
  booksReturned: number;
}

export interface Member {
  name: string;
  email: string;
  memberSince: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  available: boolean;
  copiesAvailable: number;
  totalCopies: number;
  availabilityLabel?: string;
}

export interface BorrowingRecord {
  id: string;
  book: {
    title: string;
    author: string;
    isbn: string;
  };
  borrowDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: 'Overdue' | 'Returned' | 'Currently Borrowed';
}

export interface HistoryStats {
  totalRecords: number;
  currentlyBorrowed: number;
  returned: number;
  overdue: number;
}
