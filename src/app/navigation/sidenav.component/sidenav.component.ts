import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationItem, NavigationService } from '../navigation.service';
import { RouterLink } from "@angular/router";
import { AuthStore } from '../../store/auth.store';

@Component({
    selector: 'app-sidenav',
    imports: [MatIconModule, MatButtonModule, RouterLink],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {

    closeSidenav = output<boolean>();
    ns = inject(NavigationService);
    authStore = inject(AuthStore)

    userNavigationItems: NavigationItem[] = [];
    adminNavigationItems: NavigationItem[] = [];

    constructor() {
        this.userNavigationItems = this.ns.getUserNavigationItems();
        this.adminNavigationItems = this.ns.getAdminNavigationItems();
    }

    onCloseSidenav() {
        this.closeSidenav.emit(false)
    }
}
