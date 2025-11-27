import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { BookManagement } from '../models/book-management.models';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

interface BookResponse {
  success: boolean;
  books?: any[];
  book?: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookManagementService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/catalog`;
  
  private booksData = signal<BookManagement[]>([
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      category: 'Fiction',
      isbn: '978-0-7432-7356-5',
      availability: 'Available',
      totalCopies: 3,
      availableCopies: 3
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      category: 'Fiction',
      isbn: '978-0-06-112008-4',
      availability: 'Available',
      totalCopies: 2,
      availableCopies: 1
    },
    {
      id: '3',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      category: 'Computer Science',
      isbn: '978-0-262-03384-8',
      availability: 'Available',
      totalCopies: 5,
      availableCopies: 3
    },
    {
      id: '4',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Computer Science',
      isbn: '978-0-13-235088-4',
      availability: 'Unavailable',
      totalCopies: 2,
      availableCopies: 0
    },
    {
      id: '5',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      category: 'Finance',
      isbn: '978-0-85719-927-0',
      availability: 'Available',
      totalCopies: 4,
      availableCopies: 4
    },
    {
      id: '6',
      title: 'Atomic Habits',
      author: 'James Clear',
      category: 'Self-Help',
      isbn: '978-0-7352-1129-2',
      availability: 'Available',
      totalCopies: 3,
      availableCopies: 2
    }
  ]);

  getAllBooks() {
    return this.booksData.asReadonly();
  }

  loadBooksFromAPI(): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.apiUrl}/books`).pipe(
      tap(response => {
        if (response.success && response.books) {
          const books = response.books.map(book => this.mapBookFromAPI(book));
          this.booksData.set(books);
        }
      }),
      catchError(error => {
        console.error('Error loading books:', error);
        return of({ success: false, message: 'Failed to load books' });
      })
    );
  }

  private mapBookFromAPI(apiBook: any): BookManagement {
    return {
      id: apiBook._id,
      title: apiBook.title,
      author: apiBook.author,
      category: apiBook.category,
      isbn: apiBook.isbn,
      availability: apiBook.availableCopies > 0 ? 'Available' : 'Unavailable',
      totalCopies: apiBook.totalCopies,
      availableCopies: apiBook.availableCopies
    };
  }

  addBook(bookData: { title: string; author: string; isbn: string; category: string; totalCopies: number }): Observable<BookResponse> {
    const payload = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      category: bookData.category,
      totalCopies: bookData.totalCopies,
      description: '',
      publishedYear: new Date().getFullYear()
    };

    return this.http.post<BookResponse>(`${this.apiUrl}/books`, payload, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(response => {
        if (response.success && response.book) {
          const newBook = this.mapBookFromAPI(response.book);
          this.booksData.update(books => [...books, newBook]);
        }
      }),
      catchError(error => {
        console.error('Error adding book:', error);
        return of({ success: false, message: error.error?.message || 'Failed to add book' });
      })
    );
  }

  updateBook(bookId: string, bookData: { title: string; author: string; category: string; totalCopies: number }): Observable<BookResponse> {
    const payload = {
      title: bookData.title,
      author: bookData.author,
      category: bookData.category,
      totalCopies: bookData.totalCopies,
      description: '',
      publishedYear: new Date().getFullYear()
    };

    return this.http.put<BookResponse>(`${this.apiUrl}/books/${bookId}`, payload, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(response => {
        if (response.success && response.book) {
          const updatedBook = this.mapBookFromAPI(response.book);
          this.booksData.update(books => 
            books.map(book => book.id === bookId ? updatedBook : book)
          );
        }
      }),
      catchError(error => {
        console.error('Error updating book:', error);
        return of({ success: false, message: error.error?.message || 'Failed to update book' });
      })
    );
  }

  deleteBook(bookId: string): Observable<BookResponse> {
    return this.http.delete<BookResponse>(`${this.apiUrl}/books/${bookId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(response => {
        if (response.success) {
          this.booksData.update(books => books.filter(book => book.id !== bookId));
        }
      }),
      catchError(error => {
        console.error('Error deleting book:', error);
        return of({ success: false, message: error.error?.message || 'Failed to delete book' });
      })
    );
  }
}
