import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  account = {
    username: 'Usuário',
    balance: 1000.00,
    id: '123456'
  };

  showDepositForm = false;
  showWithdrawForm = false;
  showTransferForm = false;

  depositAmount = 0;
  withdrawAmount = 0;
  transferRecipient = '';
  transferAmount = 0;

  errorMessage = '';

  toggleForm(formType: string) {
    if (formType === 'depositForm') this.showDepositForm = !this.showDepositForm;
    if (formType === 'withdrawForm') this.showWithdrawForm = !this.showWithdrawForm;
    if (formType === 'transferForm') this.showTransferForm = !this.showTransferForm;
  }

  onDeposit() {
    this.account.balance += this.depositAmount;
    this.depositAmount = 0;
    this.showDepositForm = false;
  }

  onWithdraw() {
    if (this.withdrawAmount > this.account.balance) {
      this.errorMessage = 'Saldo insuficiente!';
    } else {
      this.account.balance -= this.withdrawAmount;
      this.withdrawAmount = 0;
      this.showWithdrawForm = false;
    }
  }

  onTransfer() {
    if (this.transferAmount > this.account.balance) {
      this.errorMessage = 'Saldo insuficiente para transferência!';
    } else {
      this.account.balance -= this.transferAmount;
      this.transferRecipient = '';
      this.transferAmount = 0;
      this.showTransferForm = false;
    }
  }
}
