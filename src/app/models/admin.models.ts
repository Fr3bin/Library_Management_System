export interface AdminStats {
  totalBooks: number;
  activeUsers: number;
  booksBorrowed: number;
  overdueBooks: number;
}

export interface LibraryOverview {
  availableBooks: number;
  totalBooks: number;
  activeBorrowers: number;
  totalMembers: number;
}

export interface QuickAction {
  icon: string;
  title: string;
  description: string;
  route?: string;
}

export interface Alert {
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  details?: string;
}
