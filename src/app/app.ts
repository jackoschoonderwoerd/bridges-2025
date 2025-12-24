import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './navigation/header.component/header.component';
import { FooterComponent } from './navigation/footer.component/footer.component';
import { SidenavComponent } from './navigation/sidenav.component/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BridgeStore } from './store/brigde.store';
import { LocationService } from './core/location';

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
        MatSidenavModule
    ],
    styleUrl: './app.scss'
})
export class App {

    bridgeStore = inject(BridgeStore);
    location = inject(LocationService)

    constructor() {
        this.bridgeStore.load();
        this.location.start()
    }

}
