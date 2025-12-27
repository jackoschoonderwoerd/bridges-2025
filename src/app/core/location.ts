import { Injectable, signal } from "@angular/core";

export interface LatLng {
    lat: number;
    lng: number;
    accuracy: number;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
    position = signal<LatLng | null>(null);
    error = signal<string | null>(null);

    start() {
        navigator.geolocation.getCurrentPosition(
            pos => {
                this.position.set({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                });
            },
            err => {
                this.error.set(
                    err.code === err.PERMISSION_DENIED
                        ? 'Location permission denied'
                        : 'Unable to get location'
                );
            },
            { enableHighAccuracy: true }
        );
    }
}


