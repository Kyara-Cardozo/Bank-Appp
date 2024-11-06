import { Component, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  timestamp: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.http.get<Transaction[]>('http://localhost:8080/api/transactions').subscribe({
      next: (data) => {
        this.transactions = data;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar transações: ' + (err.message || err);
        console.error('Erro ao carregar transações:', err);
      },
    });
  }

  isPositiveTransaction(type: string): boolean {
    return type === 'Transferir' || type === 'Depositado';
  }
}
