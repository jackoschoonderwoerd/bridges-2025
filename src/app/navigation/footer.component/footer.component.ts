import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { DemoService } from '../../store/demo.service';
import { BridgeStore } from '../../store/brigde.store';
import { MatDialog } from '@angular/material/dialog';

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

    toggleDemo() {
        if (this.demoService.enabled()) {
            this.demoService.stop();
            this.matDialog.closeAll();

        } else {
            this.demoService.start(this.bridgeStore.bridges());
        }
    }
}
