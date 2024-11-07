import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

import { LoginComponent } from './app/pages/login/login.component';
import { RegisterComponent } from './app/pages/register/register.component';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { TransactionsComponent } from './app/pages/transactions/transactions.component';

const routes: Routes = [
  { path: '', component: LoginComponent },          
  { path: 'register', component: RegisterComponent }, 
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transactions', component: TransactionsComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
  ]
}).catch(err => console.error(err));
