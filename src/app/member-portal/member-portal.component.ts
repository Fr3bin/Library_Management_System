import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LibraryService } from '../services/library.service';
import { SearchBooksComponent } from '../search-books/search-books.component';
import { BorrowingHistoryComponent } from '../borrowing-history/borrowing-history.component';

@Component({
  selector: 'app-member-portal',
  imports: [CommonModule, SearchBooksComponent, BorrowingHistoryComponent],
  templateUrl: './member-portal.component.html',
  styleUrl: './member-portal.component.css'
})
export class MemberPortalComponent {
  private libraryService = inject(LibraryService);
  private router = inject(Router);
  
  member = this.libraryService.getMember();
  stats = this.libraryService.getStats();
  borrowedBooks = this.libraryService.getBorrowedBooks();
  
  activeTab = 'overview';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  returnBook(bookId: string) {
    this.libraryService.returnBook(bookId);
  }

  logout() {
    // Navigate back to the login page
    this.router.navigate(['/']);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
