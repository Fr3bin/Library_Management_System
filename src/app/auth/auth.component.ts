import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  activeTab = signal<'login' | 'register'>('login');

  // Login form
  loginEmail = '';
  loginPassword = '';

  // Register form
  registerFullName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';

  constructor(private router: Router) {}

  setActiveTab(tab: 'login' | 'register') {
    this.activeTab.set(tab);
    this.clearForms();
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
      alert('Please fill in all fields');
      return;
    }

    // Check if admin credentials
    if (this.loginEmail === 'admin@library.com' && this.loginPassword === 'admin123') {
      console.log('Admin login successful');
      this.router.navigate(['/admin']);
      return;
    }

    // Check if member credentials (any other email/password)
    if (this.loginEmail && this.loginPassword) {
      console.log('Member login successful');
      this.router.navigate(['/member-portal']);
      return;
    }

    alert('Invalid credentials');
  }

  onRegister() {
    if (!this.registerFullName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (this.registerPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // TODO: Implement actual registration
    console.log('Register attempt:', { 
      fullName: this.registerFullName, 
      email: this.registerEmail 
    });

    // After successful registration, switch to login
    alert('Registration successful! Please login.');
    this.setActiveTab('login');
  }
}
