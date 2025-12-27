import { Component, HostListener, inject, signal } from '@angular/core';
import { LocationService } from '../../core/location';
import { DEMO_BRIDGES } from '../../data/demo-bridges';
import { BridgeStore } from '../../store/brigde.store';

@Component({
    selector: 'app-demo-control',
    imports: [],
    templateUrl: './demo-control.html',
    styleUrl: './demo-control.scss',
})
export class DemoControl {
    bridgeStore = inject(BridgeStore)
    private location = inject(LocationService);

    bridges = this.bridgeStore.bridges

    /** Secret toggle: CTRL + D */
    teleport(id: string) {
        const bridge = this.bridges().find(b => b.id === id);
        if (!bridge) return;

        this.location.setDemoLocation(bridge.lat, bridge.lng);
    }

    disable() {
        this.location.disableDemoMode();
    }
}
