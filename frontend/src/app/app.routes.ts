import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MemberPortalComponent } from './member-portal/member-portal.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { 
    path: 'member-portal', 
    component: MemberPortalComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'admin', 
    component: AdminDashboardComponent,
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', redirectTo: 'auth' }
];
