import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { DemoService } from '../../store/demo.service';
import { BridgeStore } from '../../store/brigde.store';
import { MatDialog } from '@angular/material/dialog';
import { RouteControlService } from '../../store/route-control.service';
import { UiStore } from '../../store/ui.store';

@Component({
    selector: 'app-footer',
    imports: [MatIconModule, RouterModule, MatButtonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    authService = inject(AuthService);
    demoService = inject(DemoService);
    bridgeStore = inject(BridgeStore);
    matDialog = inject(MatDialog)
    routeControl = inject(RouteControlService);
    route = inject(ActivatedRoute);
    uiStore = inject(UiStore)

    constructor() {
        console.log(this.route.snapshot)

    }

    toggleDemo() {
        if (this.demoService.demoEnabled()) {
            this.demoService.stop();
            this.matDialog.closeAll();

        } else {
            this.demoService.start(this.bridgeStore.bridges());
        }
        if (this.routeControl.showRoute()) {
            this.routeControl.disable();
        }
    }


    toggleRoute() {
        this.routeControl.toggle();
    }
}
