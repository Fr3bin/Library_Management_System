import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  memberSince: string;
  status: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    // Load user from localStorage on service init
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.token.set(token);
      this.currentUser.set(JSON.parse(user));
    }
  }

  register(userData: { name: string; email: string; password: string; role?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            this.setAuth(response.token, response.user);
          }
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return of({ success: false, message: error.error?.message || 'Registration failed' });
        })
      );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            this.setAuth(response.token, response.user);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return of({ success: false, message: error.error?.message || 'Login failed' });
        })
      );
  }

  private setAuth(token: string, user: User) {
    this.token.set(token);
    this.currentUser.set(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth']);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.token();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getToken(): string | null {
    return this.token();
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'admin';
  }

  isLibrarian(): boolean {
    const user = this.currentUser();
    return user?.role === 'librarian';
  }

  isStudent(): boolean {
    const user = this.currentUser();
    return user?.role === 'student';
  }
}
