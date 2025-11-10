import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MemberPortalComponent } from './member-portal/member-portal.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'member-portal', component: MemberPortalComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];
