export interface LibraryMember {
  id: string;
  name: string;
  email: string;
  memberSince: Date;
  currentlyBorrowed: number;
  totalBorrowed: number;
  overdue: number;
  status: 'Active' | 'Inactive';
}
