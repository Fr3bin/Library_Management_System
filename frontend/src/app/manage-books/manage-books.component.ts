import { Component, inject, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookManagementService } from '../services/book-management.service';
import { BookManagement } from '../models/book-management.models';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.css']
})
export class ManageBooksComponent implements OnInit, OnDestroy {
  private bookManagementService = inject(BookManagementService);
  private eventListener?: (event: Event) => void;

  books = this.bookManagementService.getAllBooks();

  ngOnInit() {
    // Load books from API
    this.bookManagementService.loadBooksFromAPI().subscribe();
    
    // Listen for add book modal events from admin dashboard
    this.eventListener = () => this.addNewBook();
    window.addEventListener('openAddBookModal', this.eventListener);
  }

  ngOnDestroy() {
    if (this.eventListener) {
      window.removeEventListener('openAddBookModal', this.eventListener);
    }
  }
  searchQuery = signal('');
  selectedCategory = signal('all');
  showAddBookModal = signal(false);
  showEditBookModal = signal(false);
  editingBookId = signal<string | null>(null);

  // Form fields for new book
  newBook = signal({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1
  });

  // Form fields for editing book
  editBook = signal({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1
  });

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

  openEditModal(bookId: string) {
    const book = this.books().find(b => b.id === bookId);
    if (book) {
      this.editingBookId.set(bookId);
      this.editBook.set({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        totalCopies: book.totalCopies
      });
      this.showEditBookModal.set(true);
    }
  }

  addNewBook() {
    this.showAddBookModal.set(true);
  }

  closeModal() {
    this.showAddBookModal.set(false);
    this.resetForm();
  }

  closeEditModal() {
    this.showEditBookModal.set(false);
    this.editingBookId.set(null);
    this.resetEditForm();
  }

  resetForm() {
    this.newBook.set({
      title: '',
      author: '',
      isbn: '',
      category: '',
      totalCopies: 1
    });
  }

  resetEditForm() {
    this.editBook.set({
      title: '',
      author: '',
      isbn: '',
      category: '',
      totalCopies: 1
    });
  }

  submitNewBook() {
    const book = this.newBook();
    
    // Validate form
    if (!book.title || !book.author || !book.isbn || !book.category || book.totalCopies < 1) {
      alert('Please fill in all required fields');
      return;
    }

    this.bookManagementService.addBook(book).subscribe(response => {
      if (response.success) {
        alert('Book added successfully!');
        this.closeModal();
      } else {
        alert(response.message || 'Failed to add book');
      }
    });
  }

  submitEditBook() {
    const book = this.editBook();
    const bookId = this.editingBookId();
    
    // Validate form
    if (!book.title || !book.author || !book.isbn || !book.category || book.totalCopies < 1) {
      alert('Please fill in all required fields');
      return;
    }

    if (bookId) {
      this.bookManagementService.updateBook(bookId, book).subscribe(response => {
        if (response.success) {
          alert('Book updated successfully!');
          this.closeEditModal();
        } else {
          alert(response.message || 'Failed to update book');
        }
      });
    }
  }

  deleteBook(bookId: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookManagementService.deleteBook(bookId).subscribe(response => {
        if (response.success) {
          alert('Book deleted successfully!');
        } else {
          alert(response.message || 'Failed to delete book');
        }
      });
    }
  }

  updateField(field: 'title' | 'author' | 'isbn' | 'category' | 'totalCopies', value: string | number) {
    this.newBook.update(book => ({
      ...book,
      [field]: value
    }));
  }

  updateEditField(field: 'title' | 'author' | 'isbn' | 'category' | 'totalCopies', value: string | number) {
    this.editBook.update(book => ({
      ...book,
      [field]: value
    }));
  }

}
