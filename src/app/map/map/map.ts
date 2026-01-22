import { Component, inject, effect, AfterViewInit, signal } from '@angular/core';
import * as L from 'leaflet';

import { Bridge } from '../../models/bridge.model';
import { BridgeStore } from '../../store/brigde.store';
import { LocationService } from '../../core/location';
import { MatDialog } from '@angular/material/dialog';
import { BridgeDialog } from '../../pages/bridge-dialog/bridge-dialog';
import { DemoService } from '../../store/demo.service';
import 'leaflet-routing-machine';
import { RouteControlService } from '../../store/route-control.service';

// declare module 'leaflet' {
//     namespace Routing {
//         function control(options: any): Control;

//         class Control extends L.Control {
//             getPlan(): any;
//             setWaypoints(waypoints: L.LatLng[]): void;
//             remove(): void;
//         }
//     }
// }

@Component({
    selector: 'app-map',
    standalone: true,
    templateUrl: './map.html',
    styleUrls: ['./map.scss'],
})
export class MapComponent implements AfterViewInit {
    private bridgeStore = inject(BridgeStore);
    private location = inject(LocationService);
    private demoService = inject(DemoService);
    private dialog = inject(MatDialog);
    // private routeControl?: L.Routing.Control;
    private routeControl?: any;

    private map!: L.Map;
    private markers = L.layerGroup();

    private activeBridgeId: string | null = null;
    showRoute = signal(true);
    private routeControlService = inject(RouteControlService);

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

        // this.showRouteToBridge(
        //     user.lat,
        //     user.lng,
        //     nearest.lat,
        //     nearest.lng
        // );

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

            // this.openBridgeDialog(nearest);
        }

        if (this.routeControlService.showRoute()) {
            this.drawRouteTo(nearest, user);
        } else {
            this.clearRoute();
        }

        //****************** */

        // this.routeControl = (L as any).Routing.control({
        //     waypoints: [
        //         L.latLng(user.lat, user.lng),
        //         L.latLng(nearest.lat, nearest.lng),
        //     ],
        //     routeWhileDragging: false,
        //     show: false,
        //     addWaypoints: false,
        //     draggableWaypoints: false,
        // }).addTo(this.map);

        //******************* */

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
        console.log('openBridgeDialog()')
        // Prevent duplicate opens
        // if (this.activeBridgeId === bridge.id) return;

        // this.activeBridgeId = bridge.id!;
        this.dialog.closeAll();
        if (bridge) {
            this.dialog.open(BridgeDialog, {
                data: bridge,
                height: '100vh',
                width: '100vw',
                maxWidth: '100vw',
                // panelClass: 'iframe-dialog',
                // autoFocus: false,
            });
        }

    }
    private drawRouteTo(bridge: Bridge, user: { lat: number; lng: number }) {
        if (this.routeControl) return; // already showing

        this.routeControl = L.Routing.control({
            waypoints: [
                L.latLng(user.lat, user.lng),
                L.latLng(bridge.lat, bridge.lng),
            ],
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            fitSelectedRoutes: true,
        }).addTo(this.map);
    }

    private clearRoute() {
        if (!this.routeControl) return;
        this.map.removeControl(this.routeControl);
        this.routeControl = undefined;
    }

    private autoOpenDemoBridge = effect(() => {


        console.log('autoOpenDemoBridge()')
        if (this.demoService.demoEnabled()) return;

        const bridge = this.demoService.currentBridge();
        if (!bridge) return;

        this.dialog.closeAll()
        // prevent dialog spam
        if (this.dialog.openDialogs.length > 0) return;

        // setTimeout(() => {
        this.dialog.open(BridgeDialog, {
            data: bridge,
            autoFocus: false,
            width: '400px'
        });

        // }, 1000);
    });



    private demoEffect = effect(() => {
        if (!this.demoService.demoEnabled()) return;

        const bridge = this.demoService.currentBridge();
        if (!bridge) return;
        this.dialog.closeAll()
        setTimeout(() => {

            this.openBridgeDialog(bridge);
        }, 3000);
    });

    private showRouteToBridge(
        userLat: number,
        userLng: number,
        bridgeLat: number,
        bridgeLng: number
    ) {
        // Remove existing route
        if (this.routeControl) {
            this.map.removeControl(this.routeControl);
            this.routeControl = undefined;
        }

        this.routeControl = L.Routing.control({
            waypoints: [
                L.latLng(userLat, userLng),
                L.latLng(bridgeLat, bridgeLng),
            ],
            lineOptions: {
                styles: [{ color: '#1976d2', weight: 5 }],
            },
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
            }),
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
        }).addTo(this.map);
    }
}
