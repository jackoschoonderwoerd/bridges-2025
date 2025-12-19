import { Injectable } from '@angular/core';
import { bearing, distance, LatLng } from '../utils/geo';
import { Bridge } from '../models/bridge.model';

@Injectable({ providedIn: 'root' })
export class BridgeMatcherService {

    findNearest(user: LatLng, bridges: Bridge[]): Bridge | null {
        const candidates = bridges.map(bridge => {
            const d = distance(user, bridge);
            return { bridge, distance: d };
        });

        if (!candidates.length) return null;

        candidates.sort((a, b) => a.distance - b.distance);

        // Optional: only return if within 200–300 meters
        return candidates[0].distance <= 300 ? candidates[0].bridge : null;
    }
}

