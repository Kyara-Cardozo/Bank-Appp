import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  age: number | null = null;
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    const userData = {
      username: this.username,
      age: this.age,
      email: this.email,
      password: this.password
    };


    this.http.post('/api/register', userData).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao registrar o usuário.';
      }
    });
  }
}
