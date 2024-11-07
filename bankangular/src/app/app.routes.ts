import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, 
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'transactions', component: TransactionsComponent },
  ];
  

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    providers: [],

})
export class AppModule { }