import { computed, Injectable, signal } from "@angular/core";

export interface LatLng {
    lat: number;
    lng: number;
    accuracy: number;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
    position = signal<LatLng | null>(null);


    demoMode = signal<boolean>(false)

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

    setDemoLocation(lat: number, lng: number, accuracy = 5) {
        this.demoMode.set(true)
        this.position.set({ lat, lng, accuracy })
    }

    disableDemoMode() {
        this.demoMode.set(false);
        this.start();
    }

}



// import { computed, Injectable, signal } from "@angular/core";

// export interface LatLng {
//     lat: number;
//     lng: number;
//     accuracy: number;
// }

// @Injectable({ providedIn: 'root' })
// export class LocationService {
//     private realPosition = signal<LatLng | null>(null);
//     private demoPosition = signal<LatLng | null>(null);

//     position = computed(() => this.demoPosition() ?? this.realPosition());

//     error = signal<string | null>(null);

//     start() {
//         navigator.geolocation.getCurrentPosition(
//             pos => {
//                 this.realPosition.set({
//                     lat: pos.coords.latitude,
//                     lng: pos.coords.longitude,
//                     accuracy: pos.coords.accuracy,
//                 });
//             },
//             err => {
//                 this.error.set(
//                     err.code === err.PERMISSION_DENIED
//                         ? 'Location permission denied'
//                         : 'Unable to get location'
//                 );
//             },
//             { enableHighAccuracy: true }
//         );
//     }

//     setDemoPosition(lat: number, lng: number) {
//         this.demoPosition.set({
//             lat,
//             lng,
//             accuracy: 5
//         })
//     }

//     clearDemoPosition() {
//         this.demoPosition.set(null);
//     }
// }




// import { Injectable, signal } from "@angular/core";

// export interface LatLng {
//     lat: number;
//     lng: number;
//     accuracy: number;
// }

// @Injectable({ providedIn: 'root' })
// export class LocationService {
//     position = signal<LatLng | null>(null);
//     error = signal<string | null>(null);

//     start() {
//         navigator.geolocation.getCurrentPosition(
//             pos => {
//                 this.position.set({
//                     lat: pos.coords.latitude,
//                     lng: pos.coords.longitude,
//                     accuracy: pos.coords.accuracy,
//                 });
//             },
//             err => {
//                 this.error.set(
//                     err.code === err.PERMISSION_DENIED
//                         ? 'Location permission denied'
//                         : 'Unable to get location'
//                 );
//             },
//             { enableHighAccuracy: true }
//         );
//     }
// }


