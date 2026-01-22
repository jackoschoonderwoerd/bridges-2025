import { Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './navigation/header.component/header.component';
import { FooterComponent } from './navigation/footer.component/footer.component';
import { SidenavComponent } from './navigation/sidenav.component/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BridgeStore } from './store/brigde.store';
import { LocationService } from './core/location';
import { DemoControl } from './map/demo-control/demo-control';
import { UiStore } from './store/ui.store';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.html',
    // template: `<router-outlet>`,
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        SidenavComponent,
        MatSidenavModule,
        DemoControl
    ],
    styleUrl: './app.scss'
})
export class App {

    bridgeStore = inject(BridgeStore);
    location = inject(LocationService);
    private router = inject(Router);
    private uiStore = inject(UiStore);

    constructor() {
        this.bridgeStore.load();
        this.location.start();
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e: NavigationEnd) => {
                this.uiStore.setRoute(e.urlAfterRedirects);
            });
    }

    showDemo = signal(false);

    @HostListener('window:keydown.control.shift.d')
    toggleDemo() {
        this.location.demoMode.set(!this.location.demoMode())
        // this.showDemo.update(v => !v);
    }


}
