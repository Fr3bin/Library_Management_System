export interface BookManagement {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  availability: 'Available' | 'Unavailable';
  totalCopies: number;
  availableCopies: number;
}
