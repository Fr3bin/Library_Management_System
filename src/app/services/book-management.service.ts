import { Injectable, signal } from '@angular/core';
import { BookManagement } from '../models/book-management.models';

@Injectable({
  providedIn: 'root'
})
export class BookManagementService {
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

  addBook(bookData: { title: string; author: string; isbn: string; category: string; totalCopies: number }) {
    const newBook: BookManagement = {
      id: (this.booksData().length + 1).toString(),
      title: bookData.title,
      author: bookData.author,
      category: bookData.category,
      isbn: bookData.isbn,
      availability: 'Available',
      totalCopies: bookData.totalCopies,
      availableCopies: bookData.totalCopies
    };

    this.booksData.update(books => [...books, newBook]);
  }

  updateBook(bookId: string, bookData: { title: string; author: string; isbn: string; category: string; totalCopies: number }) {
    this.booksData.update(books => 
      books.map(book => {
        if (book.id === bookId) {
          // Calculate the difference in total copies
          const copyDifference = bookData.totalCopies - book.totalCopies;
          const newAvailableCopies = book.availableCopies + copyDifference;
          
          return {
            ...book,
            title: bookData.title,
            author: bookData.author,
            isbn: bookData.isbn,
            category: bookData.category,
            totalCopies: bookData.totalCopies,
            availableCopies: Math.max(0, newAvailableCopies),
            availability: newAvailableCopies > 0 ? 'Available' : 'Unavailable'
          };
        }
        return book;
      })
    );
  }

  deleteBook(bookId: string) {
    this.booksData.update(books => books.filter(book => book.id !== bookId));
  }

  editBook(bookId: string) {
    console.log('Edit book:', bookId);
    // TODO: Implement edit functionality
  }
}
