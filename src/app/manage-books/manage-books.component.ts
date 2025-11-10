import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookManagementService } from '../services/book-management.service';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.css']
})
export class ManageBooksComponent {
  private bookManagementService = inject(BookManagementService);

  books = this.bookManagementService.getAllBooks();
  searchQuery = signal('');
  selectedCategory = signal('all');

  filteredBooks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    
    return this.books().filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query);
      
      const matchesCategory = category === 'all' || book.category === category;
      
      return matchesSearch && matchesCategory;
    });
  });

  categories = computed(() => {
    const uniqueCategories = new Set(this.books().map(book => book.category));
    return Array.from(uniqueCategories);
  });

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
  }

  editBook(bookId: string) {
    this.bookManagementService.editBook(bookId);
  }

  deleteBook(bookId: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookManagementService.deleteBook(bookId);
    }
  }

  addNewBook() {
    console.log('Add new book clicked');
    // TODO: Implement add book modal/form
    alert('Add book functionality coming soon!');
  }
}
