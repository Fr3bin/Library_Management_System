import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    console.log('Logout clicked');
    // Implement logout logic
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
