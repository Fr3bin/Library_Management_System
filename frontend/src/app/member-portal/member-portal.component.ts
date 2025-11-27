import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoanService } from '../services/loan.service';
import { SearchBooksComponent } from '../search-books/search-books.component';
import { BorrowingHistoryComponent } from '../borrowing-history/borrowing-history.component';

@Component({
  selector: 'app-member-portal',
  imports: [CommonModule, SearchBooksComponent, BorrowingHistoryComponent],
  templateUrl: './member-portal.component.html',
  styleUrl: './member-portal.component.css'
})
export class MemberPortalComponent implements OnInit {
  private authService = inject(AuthService);
  private loanService = inject(LoanService);
  private router = inject(Router);
  
  member = this.authService.getCurrentUser();
  currentLoans = this.loanService.getCurrentLoansSignal();
  loanHistory = this.loanService.getLoanHistorySignal();
  
  stats = computed(() => {
    const allLoans = this.loanHistory();
    const activeLoans = allLoans.filter(l => l.status === 'active' || l.status === 'overdue');
    return {
      currentlyBorrowed: activeLoans.length,
      totalBorrowed: allLoans.length,
      booksReturned: allLoans.filter(l => l.status === 'returned').length
    };
  });
  
  borrowedBooks = computed(() => {
    const allLoans = this.loanHistory();
    return allLoans
      .filter(loan => loan.status === 'active' || loan.status === 'overdue')
      .map(loan => ({
        id: loan._id,
        title: loan.bookTitle,
        author: loan.bookAuthor,
        genre: loan.category || 'Unknown',
        dueDate: new Date(loan.dueDate),
        borrowedDate: new Date(loan.borrowDate)
      }));
  });
  
  activeTab = 'overview';

  ngOnInit() {
    // Load current loans and history
    console.log('[Member Portal] Loading loans for user:', this.member());
    
    this.loanService.getMyCurrentLoans().subscribe(response => {
      console.log('[Member Portal] Current loans response:', response);
      console.log('[Member Portal] Current loans signal value:', this.currentLoans());
    });
    
    this.loanService.getLoanHistory().subscribe(response => {
      console.log('[Member Portal] Loan history response:', response);
      console.log('[Member Portal] Loan history signal value:', this.loanHistory());
      console.log('[Member Portal] Borrowed books computed:', this.borrowedBooks());
      console.log('[Member Portal] Stats computed:', this.stats());
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  returnBook(loanId: string) {
    if (confirm('Are you sure you want to return this book?')) {
      this.loanService.returnBook(loanId).subscribe(response => {
        if (response.success) {
          alert('Book returned successfully!');
        } else {
          alert(response.message || 'Failed to return book');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getMemberSinceDate(): string {
    const member = this.member();
    if (member?.memberSince) {
      return this.formatDate(new Date(member.memberSince));
    }
    return '';
  }
}
