import { Routes } from '@angular/router';
import { MemberPortalComponent } from './member-portal/member-portal.component';

export const routes: Routes = [
  { path: '', component: MemberPortalComponent },
  { path: '**', redirectTo: '' }
];
