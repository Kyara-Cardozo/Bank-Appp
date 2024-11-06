package com.example.bankapp.service;

import com.example.bankapp.model.Account;
import com.example.bankapp.model.Transaction;
import com.example.bankapp.repository.AccountRepository;
import com.example.bankapp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class AccountService implements UserDetailsService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public Account findAccountByUsername(String username) {
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
    }

    public Account registerAccount(String username, String password) {
        Optional<Account> existingAccount = accountRepository.findByUsername(username);
        if (existingAccount.isPresent()) {
            throw new RuntimeException("Nome de usuário já cadastrado");
        }

        Account account = new Account();
        account.setUsername(username);
        account.setPassword(passwordEncoder.encode(password));
        account.setBalance(BigDecimal.ZERO);
        return accountRepository.save(account);
    }

    public void deposit(Account account, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor do depósito deve ser positivo");
        }

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        Transaction transaction = new Transaction(amount, "Depósito", LocalDateTime.now(), account);
        transactionRepository.save(transaction);
    }

    public void withdraw(Account account, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor da retirada deve ser positivo");
        }

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Saldo insuficiente");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        Transaction transaction = new Transaction(amount, "Retirada", LocalDateTime.now(), account);
        transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionHistory(Account account) {
        return transactionRepository.findAllByAccountId(account.getId());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = findAccountByUsername(username);
        if (account == null) {
            throw new UsernameNotFoundException("Nome ou senha incorretos");
        }
        return new Account(
                account.getUsername(),
                account.getPassword(),
                account.getBalance(),
                account.getTransactions(),
                authorities()
        );

    }

    public Collection<? extends GrantedAuthority> authorities() {
        return Arrays.asList(new SimpleGrantedAuthority("User"));
    }

    public void transferAmount(Account fromAccount, String toUsername, BigDecimal amount) {
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Sem fundo");
        }

        Account toAccount = accountRepository.findByUsername(toUsername)
                .orElseThrow(() -> new RuntimeException("Conta do destinatário não encontrada"));

        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        accountRepository.save(fromAccount);

        toAccount.setBalance(toAccount.getBalance().add(amount));
        accountRepository.save(toAccount);

        Transaction debitTransaction = new Transaction(
                amount,
                "Transferir para " + toAccount.getUsername(),
                LocalDateTime.now(),
                fromAccount
        );
        transactionRepository.save(debitTransaction);

        Transaction creditTransaction = new Transaction(
                amount,
                "Transferir de " + fromAccount.getUsername(),
                LocalDateTime.now(),
                toAccount
        );
        transactionRepository.save(creditTransaction);
    }

}

