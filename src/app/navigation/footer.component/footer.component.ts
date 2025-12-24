import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-footer',
    imports: [MatIconModule, RouterModule, MatButtonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    authService = inject(AuthService)
}
