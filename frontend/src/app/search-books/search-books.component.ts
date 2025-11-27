import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../services/books.service';
import { LoanService } from '../services/loan.service';
import { Book } from '../models/library.models';

@Component({
  selector: 'app-search-books',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-books.component.html',
  styleUrl: './search-books.component.css'
})
export class SearchBooksComponent implements OnInit {
  private booksService = inject(BooksService);
  private loanService = inject(LoanService);
  
  searchQuery = signal('');
  selectedCategory = signal('All Categories');
  selectedFilter = signal('All Books');
  borrowingBookId = signal<string | null>(null);
  
  allBooks = this.booksService.getBooksSignal();
  loading = this.booksService.getLoadingSignal();
  
  filteredBooks = computed(() => {
    let books: Book[] = this.allBooks();
    
    // Filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      books = books.filter((book: Book) => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query)
      );
    }
    
    // Filter by category
    if (this.selectedCategory() !== 'All Categories') {
      books = books.filter((book: Book) => book.genre === this.selectedCategory());
    }
    
    // Filter by availability
    if (this.selectedFilter() === 'Available') {
      books = books.filter((book: Book) => book.available);
    } else if (this.selectedFilter() === 'Unavailable') {
      books = books.filter((book: Book) => !book.available);
    }
    
    return books;
  });
  
  resultsCount = computed(() => this.filteredBooks().length);
  
  categories = ['All Categories', 'Fiction', 'Science Fiction', 'Computer Science', 'Finance', 'Self-Help'];
  filters = ['All Books', 'Available', 'Unavailable'];
  
  ngOnInit() {
    // Load books from API
    this.booksService.getAllBooks().subscribe();
  }
  
  onSearchChange(value: string) {
    this.searchQuery.set(value);
    
    // Optionally search via API if you want server-side search
    if (value.trim()) {
      this.booksService.searchBooks(value, 
        this.selectedCategory() !== 'All Categories' ? this.selectedCategory() : undefined
      ).subscribe();
    } else {
      this.booksService.getAllBooks().subscribe();
    }
  }
  
  onCategoryChange(value: string) {
    this.selectedCategory.set(value);
  }
  
  onFilterChange(value: string) {
    this.selectedFilter.set(value);
  }
  
  borrowBook(bookId: string) {
    this.borrowingBookId.set(bookId);
    
    this.loanService.borrowBook(bookId).subscribe(response => {
      this.borrowingBookId.set(null);
      
      if (response.success) {
        alert('Book borrowed successfully! Check your loans in the Member Portal.');
        // Refresh books to show updated availability
        this.booksService.getAllBooks().subscribe();
      } else {
        alert(response.message || 'Failed to borrow book. Please try again.');
      }
    });
  }
  
  canBorrow(book: Book): boolean {
    return book.available && book.copiesAvailable > 0;
  }
  
  isBorrowing(bookId: string): boolean {
    return this.borrowingBookId() === bookId;
  }
}
