import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class LocationService {
    position = signal<GeolocationPosition | null>(null);
    error = signal<string | null>(null);

    start() {

        navigator.geolocation.getCurrentPosition(
            pos => this.position.set(pos),
            err => {
                if (err.code === err.PERMISSION_DENIED) {
                    this.error.set('Location permission denied');
                } else {
                    this.error.set('Unable to get location');
                }
            },
            { enableHighAccuracy: true }
        );
    }
}
