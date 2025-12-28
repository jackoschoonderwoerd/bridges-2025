import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { DemoService } from "../store/demo.service";

export interface LatLng {
    lat: number;
    lng: number;
    accuracy: number;
}

@Injectable({ providedIn: 'root' })
export class LocationService {

    private demoService = inject(DemoService);

    position = signal<LatLng | null>(null);


    demoMode = signal<boolean>(false)

    error = signal<string | null>(null);

    constructor() {
        effect(() => {
            if (!this.demoService.enabled()) return;

            const bridge = this.demoService.currentBridge();
            if (!bridge) return;

            // Fake location near the bridge
            this.position.set({
                lat: bridge.lat,
                lng: bridge.lng,
                accuracy: 5,
            });
        });
    }

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

    setDemoLocation(lat: number, lng: number, accuracy = 5) {
        this.demoMode.set(true)
        this.position.set({ lat, lng, accuracy })
        console.log(this.position());
    }

    disableDemoMode() {
        this.demoMode.set(false);
        this.start();
    }

}



