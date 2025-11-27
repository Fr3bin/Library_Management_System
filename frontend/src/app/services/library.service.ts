import { Injectable, signal } from '@angular/core';
import { BorrowedBook, MemberStats, Member } from '../models/library.models';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private member = signal<Member>({
    name: 'John Doe',
    email: 'john@example.com',
    memberSince: new Date('2024-01-10')
  });

  private stats = signal<MemberStats>({
    currentlyBorrowed: 1,
    totalBorrowed: 2,
    booksReturned: 1
  });

  private borrowedBooks = signal<BorrowedBook[]>([
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      dueDate: new Date('2024-02-08'),
      borrowedDate: new Date('2024-01-25')
    }
  ]);

  getMember() {
    return this.member.asReadonly();
  }

  getStats() {
    return this.stats.asReadonly();
  }

  getBorrowedBooks() {
    return this.borrowedBooks.asReadonly();
  }

  returnBook(bookId: string) {
    this.borrowedBooks.update(books => books.filter(b => b.id !== bookId));
    this.stats.update(stats => ({
      ...stats,
      currentlyBorrowed: stats.currentlyBorrowed - 1,
      booksReturned: stats.booksReturned + 1
    }));
  }
}
