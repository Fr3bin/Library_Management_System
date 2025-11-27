import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  activeTab = signal<'login' | 'register'>('login');
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Login form
  loginEmail = '';
  loginPassword = '';

  // Register form
  registerFullName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  setActiveTab(tab: 'login' | 'register') {
    this.activeTab.set(tab);
    this.clearForms();
    this.errorMessage.set('');
  }

  clearForms() {
    this.loginEmail = '';
    this.loginPassword = '';
    this.registerFullName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
  }

  onLogin() {
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login({
      email: this.loginEmail,
      password: this.loginPassword
    }).subscribe(response => {
      this.loading.set(false);
      
      if (response.success && response.user) {
        console.log('Login successful:', response.user);
        
        // Navigate based on role
        if (response.user.role === 'admin' || response.user.role === 'librarian') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/member-portal']);
        }
      } else {
        this.errorMessage.set(response.message || 'Login failed. Please check your credentials.');
      }
    });
  }

  onRegister() {
    if (!this.registerFullName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    if (this.registerPassword.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.register({
      name: this.registerFullName,
      email: this.registerEmail,
      password: this.registerPassword,
      role: 'student' // Default role for new registrations
    }).subscribe(response => {
      this.loading.set(false);
      
      if (response.success) {
        alert('Registration successful! You are now logged in.');
        // Navigate to member portal after successful registration
        this.router.navigate(['/member-portal']);
      } else {
        this.errorMessage.set(response.message || 'Registration failed. Please try again.');
      }
    });
  }
}
