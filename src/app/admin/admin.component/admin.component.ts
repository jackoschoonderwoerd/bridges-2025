import { Component, computed, inject } from '@angular/core';
import { BridgeFirestoreService } from '../../core/bridge-firestore-service';
import { Bridge } from '../../models/bridge.model';
import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../store/auth.store';
import { ImportBridges } from '../../utils/import-bridges/import-bridges';

@Component({
    selector: 'app-admin.component',
    imports: [FormsModule, MatFormFieldModule, MatInput, MatButtonModule, MatIconModule, ImportBridges],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
})
export class AdminComponent {
    private bridgeService = inject(BridgeFirestoreService);

    private auth = inject(AuthStore);
    private router = inject(Router);

    bridges = computed(() => this.bridgeService.bridges());

    current: Bridge = { name: '', slug: '', lat: null, lng: null, description: '' };

    constructor() {
        this.bridgeService.loadBridges();
    }

    async saveBridge() {
        if (this.current.id) {
            await this.bridgeService.updateBridge(this.current);
        } else {
            await this.bridgeService.addBridge(this.current);
        }
        this.reset();
    }

    edit(bridge: Bridge) {
        this.current = { ...bridge };
    }

    async delete(id: string) {
        if (!id) return;
        await this.bridgeService.deleteBridge(id);
    }

    reset() {
        this.current = { name: '', slug: '', lat: 0, lng: 0, description: '' };
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/admin/login']);
    }
}
