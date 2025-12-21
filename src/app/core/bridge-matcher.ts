import { Injectable, inject, computed } from '@angular/core';

import { Bridge } from '../models/bridge.model';
import { BridgeStore } from '../store/brigde.store';

@Injectable({ providedIn: 'root' })
export class BridgeMatcherService {
    private bridgeStore = inject(BridgeStore);

    // reactively consume Firestore bridges
    private bridges = computed(() => this.bridgeStore.bridges());

    findNearest(lat: number, lng: number): Bridge | null {
        const bridges = this.bridges();
        if (!bridges.length) return null;

        let closest: Bridge | null = null;
        let minDistance = Infinity;

        for (const bridge of bridges) {
            const d = this.distance(lat, lng, bridge.lat, bridge.lng);
            if (d < minDistance) {
                minDistance = d;
                closest = bridge;
            }
        }

        return closest;
    }

    private distance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}



