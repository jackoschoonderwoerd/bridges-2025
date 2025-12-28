import { Component, inject, effect, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

import { Bridge } from '../../models/bridge.model';
import { BridgeStore } from '../../store/brigde.store';
import { LocationService } from '../../core/location';
import { MatDialog } from '@angular/material/dialog';
import { BridgeDialog } from '../../pages/bridge-dialog/bridge-dialog';
import { DemoService } from '../../store/demo.service';

@Component({
    selector: 'app-map',
    standalone: true,
    template: `<div id="map"></div>`,
    styles: [`#map { height: 100vh; width: 100%; }`],
})
export class MapComponent implements AfterViewInit {
    private bridgeStore = inject(BridgeStore);
    private location = inject(LocationService);
    private demoService = inject(DemoService);
    private dialog = inject(MatDialog);

    private map!: L.Map;
    private markers = L.layerGroup();

    private activeBridgeId: string | null = null;

    /* ===========================
       DEMO AUTO-OPEN EFFECT
       =========================== */
    // private demoEffect = effect(() => {
    //     const bridge = this.demoService.currentBridge();
    //     if (!bridge) return;

    //     // prevent duplicate opens
    //     if (this.activeBridgeId === bridge.id) return;

    //     this.activeBridgeId = bridge.id!;
    //     this.dialog.closeAll();
    //     setTimeout(() => {

    //         this.openBridgeDialog(bridge);
    //     }, 1500);
    // });

    /* ===========================
       MAP UPDATE EFFECT
       =========================== */
    private mapEffect = effect(() => {
        const user = this.location.position();
        const bridges = this.bridgeStore.bridges();

        if (!this.map || !user || !bridges.length) return;

        this.markers.clearLayers();

        /* Bridges */
        bridges.forEach(b => {
            if (b.lat == null || b.lng == null) return;

            const marker = L.marker([b.lat, b.lng])
                .on('click', () => {
                    console.log('marker clicked')
                    this.demoService.stop();
                    this.dialog.closeAll()
                    this.openBridgeDialog(b);
                    this.activeBridgeId = b.id!;
                });

            marker.addTo(this.markers);
        });



        /* User */
        L.circleMarker([user.lat, user.lng], {
            radius: 8,
            color: 'blue',
        }).addTo(this.markers);

        /* Nearest bridge */
        const nearest = this.findNearestBridge(user.lat, user.lng, bridges);
        if (!nearest) return;

        L.circleMarker([nearest.lat, nearest.lng], {
            radius: 12,
            color: 'red',
            weight: 3,
            fillOpacity: 0.7,
        })
            .bindPopup(`Nearest bridge: <strong>${nearest.name}</strong>`)
            .addTo(this.markers);

        // Auto-open only if changed & not demo-driven
        if (
            !this.demoService.currentBridge() &&
            nearest.id !== this.activeBridgeId &&
            this.dialog.openDialogs.length === 0
        ) {
            this.activeBridgeId = nearest.id!;

            this.openBridgeDialog(nearest);
        }

        this.map.setView([user.lat, user.lng], 16);
    });

    ngAfterViewInit() {
        this.map = L.map('map').setView([52.3698, 4.9152], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
        }).addTo(this.map);

        this.markers.addTo(this.map);

        this.location.start();
        this.bridgeStore.load();
    }

    /* ===========================
       HELPERS
       =========================== */
    private findNearestBridge(
        userLat: number,
        userLng: number,
        bridges: Bridge[]
    ): Bridge | null {
        let nearest: Bridge | null = null;
        let minDistance = Infinity;

        for (const b of bridges) {
            if (b.lat == null || b.lng == null) continue;
            const dist = this.distance(userLat, userLng, b.lat, b.lng);
            if (dist < minDistance) {
                minDistance = dist;
                nearest = b;
            }
        }
        return nearest;
    }

    private distance(
        lat1: number,
        lng1: number,
        lat2: number,
        lng2: number
    ): number {
        const toRad = (v: number) => (v * Math.PI) / 180;
        const R = 6371000;

        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) ** 2;

        return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private openBridgeDialog(bridge: Bridge) {
        this.dialog.open(BridgeDialog, {
            data: bridge,
            width: '400px',
            autoFocus: false,
        });
    }
    private autoOpenDemoBridge = effect(() => {
        console.log('autoOpenDemoBridge()')
        if (!this.demoService.enabled()) return;

        const bridge = this.demoService.currentBridge();
        if (!bridge) return;

        this.dialog.closeAll()
        // prevent dialog spam
        if (this.dialog.openDialogs.length > 0) return;

        this.dialog.open(BridgeDialog, {
            data: bridge,
            autoFocus: false,
            width: '400px'
        });
    });

    private demoEffect = effect(() => {
        if (!this.demoService.enabled()) return;

        const bridge = this.demoService.currentBridge();
        if (!bridge) return;

        if (this.activeBridgeId === bridge.id) return;

        this.activeBridgeId = bridge.id!;
        this.dialog.closeAll();

        setTimeout(() => {
            this.openBridgeDialog(bridge);
        }, 1000);
    });

    // private startDemoEffect = effect(() => {
    //     const bridges = this.bridgeStore.bridges();

    //     if (!bridges.length) return;
    //     if (this.demoService.enabled()) return;

    //     // 🔥 Start demo using REAL bridges

    //     this.demoService.start(bridges);
    // });
}


// import { Component, inject, computed, effect, AfterViewInit } from '@angular/core';
// import * as L from 'leaflet';

// import { Bridge } from '../../models/bridge.model';
// import { BridgeStore } from '../../store/brigde.store';
// import { LocationService } from '../../core/location';
// import { MatDialog } from '@angular/material/dialog';
// import { BridgeDialog } from '../../pages/bridge-dialog/bridge-dialog';
// import { DemoService } from '../../store/demo.service';

// @Component({
//     selector: 'app-map',
//     standalone: true,
//     template: `<div id="map"></div>`,
//     styles: [`#map { height: 100vh; width: 100%; }`],
// })
// export class MapComponent implements AfterViewInit {
//     private bridgeStore = inject(BridgeStore);
//     private location = inject(LocationService);

//     private demoService = inject(DemoService)

//     private map!: L.Map;
//     private markers = L.layerGroup();
//     private dialog = inject(MatDialog);
//     private activeBridgeId: string | null = null;

//     private autoOpenDemoBridge = effect(() => {
//         const bridge = this.demoService.currentBridge();
//         console.log('bridge found')
//         if (!bridge) return;

//         this.dialog.open(BridgeDialog, {
//             data: bridge,
//             autoFocus: false,
//         });
//     });

//     // 🔑 EFFECT IS A FIELD (this fixes NG0203)
//     private updateMapEffect = effect(() => {
//         const user = this.location.position();
//         const bridges = this.bridgeStore.bridges();
//         if (!bridges.length || !user || !this.map) return;

//         this.markers.clearLayers();

//         // Bridges
//         bridges.forEach(b => {
//             if (b.lat == null || b.lng == null) return;
//             const marker = L.marker([b.lat, b.lng]).addTo(this.markers);
//             marker
//                 .on('click', () => {
//                     this.activeBridgeId = b.id!;
//                     this.openBridgeDialog(b);
//                 })
//                 .addTo(this.markers);
//         });



//         // User
//         L.circleMarker([user.lat, user.lng], {
//             radius: 8,
//             color: 'blue',
//         }).addTo(this.markers);

//         // 3️⃣ Find nearest bridge
//         const nearest = this.findNearestBridge(user.lat, user.lng, bridges);
//         if (!nearest) return;

//         if (nearest) {
//             L.circleMarker([nearest.lat, nearest.lng], {
//                 radius: 12,
//                 color: 'red',
//                 weight: 3,
//                 fillColor: '#ff0000',
//                 fillOpacity: 0.7,
//             })
//                 .bindPopup(`Nearest bridge: <strong>${nearest.name}</strong>`)
//                 .addTo(this.markers);
//         }




//         if (nearest && nearest.id !== this.activeBridgeId) {
//             this.activeBridgeId = nearest.id;
//             // this.openBridgeDialog(nearest);
//             if (this.dialog.openDialogs.length === 0) {
//                 this.openBridgeDialog(nearest);
//             }
//         }

//         // 4️⃣ 🔴 Highlight nearest bridge (THIS IS WHERE YOUR CODE GOES)
//         L.circleMarker([nearest.lat, nearest.lng], {
//             radius: 12,
//             color: 'red',
//             weight: 3,
//             fillOpacity: 0.7,
//         })

//         // Center map
//         this.map.setView([user.lat, user.lng], 16);
//     });

//     ngAfterViewInit() {
//         // Only map setup here
//         this.map = L.map('map').setView([52.3698, 4.9152], 15);

//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '© OpenStreetMap',
//         }).addTo(this.map);

//         this.markers.addTo(this.map);

//         // Start location tracking
//         this.location.start();
//         this.bridgeStore.load();
//     }


//     private findNearestBridge(
//         userLat: number,
//         userLng: number,
//         bridges: Bridge[]
//     ): Bridge | null {
//         let nearest: Bridge | null = null;
//         let minDistance = Infinity;

//         for (const b of bridges) {
//             if (b.lat == null || b.lng == null) continue;

//             const dist = this.distance(userLat, userLng, b.lat, b.lng);
//             if (dist < minDistance) {
//                 minDistance = dist;
//                 nearest = b;
//             }
//         }

//         return nearest;
//     }
//     private distance(
//         lat1: number,
//         lng1: number,
//         lat2: number,
//         lng2: number
//     ): number {
//         const toRad = (v: number) => (v * Math.PI) / 180;
//         const R = 6371000; // meters

//         const dLat = toRad(lat2 - lat1);
//         const dLng = toRad(lng2 - lng1);

//         const a =
//             Math.sin(dLat / 2) ** 2 +
//             Math.cos(toRad(lat1)) *
//             Math.cos(toRad(lat2)) *
//             Math.sin(dLng / 2) ** 2;

//         return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     }

//     private openBridgeDialog(bridge: Bridge) {
//         this.dialog.open(BridgeDialog, {
//             data: bridge,
//             width: '400px',
//             autoFocus: false,
//         });
//     }
// }
