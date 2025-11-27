import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BorrowingHistoryService } from '../services/borrowing-history.service';
import { LoanService } from '../services/loan.service';
import { BorrowingRecord } from '../models/library.models';

@Component({
  selector: 'app-borrowing-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './borrowing-history.component.html',
  styleUrl: './borrowing-history.component.css'
})
export class BorrowingHistoryComponent implements OnInit {
  private historyService = inject(BorrowingHistoryService);
  private loanService = inject(LoanService);
  
  searchQuery = signal('');
  selectedStatus = signal('All Status');
  selectedSortOrder = signal('Descending');
  
  allRecords = this.historyService.getBorrowingHistory();
  historyStats = this.historyService.getHistoryStats();

  ngOnInit() {
    // Load loan history from API
    this.loanService.getLoanHistory().subscribe();
  }
  
  filteredRecords = computed(() => {
    let records: BorrowingRecord[] = this.allRecords();
    
    // Filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      records = records.filter((record: BorrowingRecord) => 
        record.book.title.toLowerCase().includes(query) ||
        record.book.author.toLowerCase().includes(query) ||
        record.book.isbn.includes(query)
      );
    }
    
    // Filter by status
    if (this.selectedStatus() !== 'All Status') {
      records = records.filter((record: BorrowingRecord) => 
        record.status === this.selectedStatus()
      );
    }
    
    // Sort by borrow date
    records = [...records].sort((a, b) => {
      const dateA = new Date(a.borrowDate).getTime();
      const dateB = new Date(b.borrowDate).getTime();
      return this.selectedSortOrder() === 'Descending' ? dateB - dateA : dateA - dateB;
    });
    
    return records;
  });
  
  recordsCount = computed(() => this.filteredRecords().length);
  totalCount = computed(() => this.allRecords().length);
  
  statusOptions = ['All Status', 'Overdue', 'Returned', 'Currently Borrowed'];
  sortOptions = ['Descending', 'Ascending'];
  
  onSearchChange(value: string) {
    this.searchQuery.set(value);
  }
  
  onStatusChange(value: string) {
    this.selectedStatus.set(value);
  }
  
  onSortOrderChange() {
    const current = this.selectedSortOrder();
    this.selectedSortOrder.set(current === 'Descending' ? 'Ascending' : 'Descending');
  }
  
  returnBook(recordId: string) {
    this.historyService.returnBook(recordId);
  }
  
  canReturn(record: BorrowingRecord): boolean {
    return record.status === 'Overdue' || record.status === 'Currently Borrowed';
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'Overdue':
        return 'status-overdue';
      case 'Returned':
        return 'status-returned';
      case 'Currently Borrowed':
        return 'status-borrowed';
      default:
        return '';
    }
  }
}
