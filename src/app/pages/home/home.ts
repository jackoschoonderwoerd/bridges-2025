import { Component, computed, inject, InjectionToken } from '@angular/core';

import { LocationService } from '../../core/location';

import { DecimalPipe, NgIf } from '@angular/common';
import { BridgeMatcherService } from '../../core/bridge-matcher';
import { MatButtonModule } from '@angular/material/button';
import { BridgeStore } from '../../store/brigde.store';
import { AuthStore } from '../../store/auth.store';


@Component({
    selector: 'app-home',
    imports: [DecimalPipe, MatButtonModule],
    templateUrl: './home.html',

    styleUrl: './home.scss',

})
export class HomeComponent {
    location = inject(LocationService);
    matcher = inject(BridgeMatcherService);
    bridgeStore = inject(BridgeStore);
    authStore = inject(AuthStore)

    start() {
        this.location.start();
    }

    bridge = computed(() => {
        const pos = this.location.position();
        if (!pos) return null;

        return this.matcher.findNearest(
            pos.coords.latitude, pos.coords.longitude,
            // BRIDGES
        );
    });
}
