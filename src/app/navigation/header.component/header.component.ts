import { Component, inject, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { NavigationItem, NavigationService } from '../navigation.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../store/auth.store';


@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, RouterModule, MatButtonModule, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    ns = inject(NavigationService)
    authStore = inject(AuthStore)

    userNavigationItems: NavigationItem[] = [];
    adminNavigationItems: NavigationItem[] = [];

    sidenavToggle = output<void>()

    constructor() {
        this.userNavigationItems = this.ns.getUserNavigationItems();
        this.adminNavigationItems = this.ns.getAdminNavigationItems();
    }

    toggleSidenav() {
        this.sidenavToggle.emit()
    }
}
