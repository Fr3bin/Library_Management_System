import { Injectable, signal } from '@angular/core';
import { Book } from '../models/library.models';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private books = signal<Book[]>([
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      genre: 'Fiction',
      available: true,
      copiesAvailable: 2,
      totalCopies: 3,
      availabilityLabel: 'Available'
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      genre: 'Fiction',
      available: true,
      copiesAvailable: 1,
      totalCopies: 2,
      availabilityLabel: 'Available'
    },
    {
      id: '3',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0-262-03384-8',
      genre: 'Computer Science',
      available: true,
      copiesAvailable: 3,
      totalCopies: 5,
      availabilityLabel: 'Available'
    },
    {
      id: '4',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0-13-235088-4',
      genre: 'Computer Science',
      available: false,
      copiesAvailable: 0,
      totalCopies: 2,
      availabilityLabel: 'Unavailable'
    },
    {
      id: '5',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      isbn: '978-0-85719-927-9',
      genre: 'Finance',
      available: true,
      copiesAvailable: 4,
      totalCopies: 4,
      availabilityLabel: 'Available'
    },
    {
      id: '6',
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '978-0-7352-1129-2',
      genre: 'Self-Help',
      available: true,
      copiesAvailable: 2,
      totalCopies: 3,
      availabilityLabel: 'Available'
    }
  ]);

  getAllBooks() {
    return this.books.asReadonly();
  }

  borrowBook(bookId: string) {
    this.books.update(books => 
      books.map(book => {
        if (book.id === bookId && book.copiesAvailable > 0) {
          return {
            ...book,
            copiesAvailable: book.copiesAvailable - 1,
            available: book.copiesAvailable - 1 > 0,
            availabilityLabel: book.copiesAvailable - 1 > 0 ? 'Available' : 'Unavailable'
          };
        }
        return book;
      })
    );
  }
}
