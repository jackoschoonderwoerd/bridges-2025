import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class LocationService {
    position = signal<GeolocationPosition | null>(null);

    start() {
        navigator.geolocation.watchPosition(pos =>
            this.position.set(pos)
        );
    }
}
