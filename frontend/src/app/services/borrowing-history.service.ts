import { Injectable, signal, computed, inject } from '@angular/core';
import { BorrowingRecord, HistoryStats } from '../models/library.models';
import { LoanService } from './loan.service';

@Injectable({
  providedIn: 'root'
})
export class BorrowingHistoryService {
  private loanService = inject(LoanService);
  
  private records = computed<BorrowingRecord[]>(() => {
    const loans = this.loanService.getLoanHistorySignal()();
    return loans.map(loan => ({
      id: loan._id,
      book: {
        title: loan.bookTitle,
        author: loan.bookAuthor,
        isbn: loan.bookId // Using bookId as ISBN placeholder
      },
      borrowDate: new Date(loan.borrowDate),
      dueDate: new Date(loan.dueDate),
      returnDate: loan.returnDate ? new Date(loan.returnDate) : null,
      status: this.mapLoanStatus(loan.status, loan.dueDate, loan.returnDate)
    }));
  });

  private stats = computed<HistoryStats>(() => {
    const allRecords = this.records();
    return {
      totalRecords: allRecords.length,
      currentlyBorrowed: allRecords.filter(r => r.status === 'Currently Borrowed').length,
      returned: allRecords.filter(r => r.status === 'Returned').length,
      overdue: allRecords.filter(r => r.status === 'Overdue').length
    };
  });

  private mapLoanStatus(status: string, dueDate: string, returnDate: string | null): 'Overdue' | 'Returned' | 'Currently Borrowed' {
    if (returnDate) {
      return 'Returned';
    }
    if (status === 'overdue' || (status === 'active' && new Date(dueDate) < new Date())) {
      return 'Overdue';
    }
    return 'Currently Borrowed';
  }

  getBorrowingHistory() {
    return this.records;
  }

  getHistoryStats() {
    return this.stats;
  }

  returnBook(recordId: string) {
    // Use the actual loan service to return the book
    this.loanService.returnBook(recordId).subscribe();
  }
}
