import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {TransactionsComponent} from './pages/transactions/transactions.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, LoginComponent, RegisterComponent, TransactionsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bankangular';
}
