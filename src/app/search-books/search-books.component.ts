import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../services/books.service';
import { Book } from '../models/library.models';

@Component({
  selector: 'app-search-books',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-books.component.html',
  styleUrl: './search-books.component.css'
})
export class SearchBooksComponent {
  private booksService = inject(BooksService);
  
  searchQuery = signal('');
  selectedCategory = signal('All Categories');
  selectedFilter = signal('All Books');
  
  allBooks = this.booksService.getAllBooks();
  
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
  
  categories = ['All Categories', 'Fiction', 'Computer Science', 'Finance', 'Self-Help'];
  filters = ['All Books', 'Available', 'Unavailable'];
  
  onSearchChange(value: string) {
    this.searchQuery.set(value);
  }
  
  onCategoryChange(value: string) {
    this.selectedCategory.set(value);
  }
  
  onFilterChange(value: string) {
    this.selectedFilter.set(value);
  }
  
  borrowBook(bookId: string) {
    this.booksService.borrowBook(bookId);
  }
  
  canBorrow(book: Book): boolean {
    return book.available && book.copiesAvailable > 0;
  }
}
