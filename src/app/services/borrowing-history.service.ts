import { Injectable, signal, computed } from '@angular/core';
import { BorrowingRecord, HistoryStats } from '../models/library.models';

@Injectable({
  providedIn: 'root'
})
export class BorrowingHistoryService {
  private records = signal<BorrowingRecord[]>([
    {
      id: '1',
      book: {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5'
      },
      borrowDate: new Date('2024-01-25'),
      dueDate: new Date('2024-02-08'),
      returnDate: null,
      status: 'Overdue'
    },
    {
      id: '2',
      book: {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        isbn: '978-0-262-03384-8'
      },
      borrowDate: new Date('2024-01-15'),
      dueDate: new Date('2024-01-29'),
      returnDate: new Date('2024-01-28'),
      status: 'Returned'
    }
  ]);

  private stats = computed<HistoryStats>(() => {
    const allRecords = this.records();
    return {
      totalRecords: allRecords.length,
      currentlyBorrowed: allRecords.filter(r => r.status === 'Currently Borrowed').length,
      returned: allRecords.filter(r => r.status === 'Returned').length,
      overdue: allRecords.filter(r => r.status === 'Overdue').length
    };
  });

  getBorrowingHistory() {
    return this.records.asReadonly();
  }

  getHistoryStats() {
    return this.stats;
  }

  returnBook(recordId: string) {
    this.records.update(records => 
      records.map(record => {
        if (record.id === recordId && (record.status === 'Overdue' || record.status === 'Currently Borrowed')) {
          return {
            ...record,
            returnDate: new Date(),
            status: 'Returned' as const
          };
        }
        return record;
      })
    );
  }
}
