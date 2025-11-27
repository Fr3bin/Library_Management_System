import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Book } from '../models/library.models';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

interface BookResponse {
  success: boolean;
  books?: any[];
  book?: any;
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private apiUrl = `${environment.apiUrl}/catalog`;
  private books = signal<Book[]>([]);
  private loading = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllBooks(): Observable<BookResponse> {
    this.loading.set(true);
    return this.http.get<BookResponse>(`${this.apiUrl}/books`)
      .pipe(
        tap(response => {
          if (response.success && response.books) {
            const books = response.books.map(book => this.mapBookFromApi(book));
            this.books.set(books);
          }
          this.loading.set(false);
        }),
        catchError(error => {
          console.error('Error fetching books:', error);
          this.loading.set(false);
          return of({ success: false, message: 'Failed to fetch books' });
        })
      );
  }

  searchBooks(query: string, category?: string): Observable<BookResponse> {
    let url = `${this.apiUrl}/books?`;
    if (query) url += `search=${encodeURIComponent(query)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;

    return this.http.get<BookResponse>(url)
      .pipe(
        tap(response => {
          if (response.success && response.books) {
            const books = response.books.map(book => this.mapBookFromApi(book));
            this.books.set(books);
          }
        }),
        catchError(error => {
          console.error('Error searching books:', error);
          return of({ success: false, message: 'Search failed' });
        })
      );
  }

  getBookById(id: string): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.apiUrl}/books/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching book:', error);
          return of({ success: false, message: 'Failed to fetch book' });
        })
      );
  }

  private mapBookFromApi(apiBook: any): Book {
    return {
      id: apiBook._id,
      title: apiBook.title,
      author: apiBook.author,
      isbn: apiBook.isbn,
      genre: apiBook.category,
      available: apiBook.availableCopies > 0 && (apiBook.status === 'available' || apiBook.status === 'Available'),
      copiesAvailable: apiBook.availableCopies,
      totalCopies: apiBook.totalCopies,
      availabilityLabel: apiBook.availableCopies > 0 ? 'Available' : 'Unavailable'
    };
  }

  getBooksSignal() {
    return this.books.asReadonly();
  }

  getLoadingSignal() {
    return this.loading.asReadonly();
  }
}
