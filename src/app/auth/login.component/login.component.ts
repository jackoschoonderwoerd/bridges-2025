import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { AuthStore } from '../../store/auth.store';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatButtonModule, MatInput],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
    //     template: `
    //     <h1>Admin Login</h1>

    //     <form (ngSubmit)="login()">
    //       <input [(ngModel)]="email" name="email" placeholder="Email" required />
    //       <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required />
    //       <button type="submit">Login</button>
    //     </form>

    //     <p *ngIf="error">{{ error }}</p>
    //   `
})
export class LoginComponent {
    private auth = inject(AuthStore);
    private router = inject(Router);

    email = 'jackoboes@gmail.com';
    password = '123456';
    error = '';

    async login() {
        try {
            await this.auth.login(this.email, this.password);
            this.router.navigate(['/admin']);
        } catch {
            this.error = 'Invalid credentials';
        }
    }
}
