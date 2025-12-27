

import { Component, inject, computed, effect, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

import { Bridge } from '../../models/bridge.model';
import { BridgeStore } from '../../store/brigde.store';
import { LocationService } from '../../core/location';
import { MatDialog } from '@angular/material/dialog';
import { BridgeDialog } from '../../pages/bridge-dialog/bridge-dialog';

@Component({
    selector: 'app-map',
    standalone: true,
    template: `<div id="map"></div>`,
    styles: [`#map { height: 100vh; width: 100%; }`],
})
export class MapComponent implements AfterViewInit {
    private bridgeStore = inject(BridgeStore);
    private location = inject(LocationService);

    private map!: L.Map;
    private markers = L.layerGroup();
    private dialog = inject(MatDialog);
    private activeBridgeId: string | null = null;




    // 🔑 EFFECT IS A FIELD (this fixes NG0203)
    private updateMapEffect = effect(() => {
        const user = this.location.position();
        const bridges = this.bridgeStore.bridges();
        if (!bridges.length || !user || !this.map) return;

        this.markers.clearLayers();

        // Bridges
        bridges.forEach(b => {
            if (b.lat == null || b.lng == null) return;
            const marker = L.marker([b.lat, b.lng]).addTo(this.markers);
            marker
                .on('click', () => {
                    // this.dialog.open(BridgeDialog, {
                    //     data: b,
                    // });
                    this.activeBridgeId = b.id!;
                    this.openBridgeDialog(b);
                })
                .addTo(this.markers);
        });



        // User
        L.circleMarker([user.lat, user.lng], {
            radius: 8,
            color: 'blue',
        }).addTo(this.markers);

        // 3️⃣ Find nearest bridge
        const nearest = this.findNearestBridge(user.lat, user.lng, bridges);
        if (!nearest) return;

        if (nearest) {
            L.circleMarker([nearest.lat, nearest.lng], {
                radius: 12,
                color: 'red',
                weight: 3,
                fillColor: '#ff0000',
                fillOpacity: 0.7,
            })
                .bindPopup(`Nearest bridge: <strong>${nearest.name}</strong>`)
                .addTo(this.markers);
        }

        // L.circleMarker([nearest.lat, nearest.lng], {
        //     radius: 12,
        //     color: 'red',
        //     weight: 3,
        //     fillOpacity: 0.7,
        // })
        //     .addTo(this.markers);


        if (nearest && nearest.id !== this.activeBridgeId) {
            this.activeBridgeId = nearest.id;
            // this.openBridgeDialog(nearest);
            if (this.dialog.openDialogs.length === 0) {
                this.openBridgeDialog(nearest);
            }
        }

        // 4️⃣ 🔴 Highlight nearest bridge (THIS IS WHERE YOUR CODE GOES)
        L.circleMarker([nearest.lat, nearest.lng], {
            radius: 12,
            color: 'red',
            weight: 3,
            fillOpacity: 0.7,
        })

        // Center map
        this.map.setView([user.lat, user.lng], 16);
    });

    ngAfterViewInit() {
        // Only map setup here
        this.map = L.map('map').setView([52.3698, 4.9152], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
        }).addTo(this.map);

        this.markers.addTo(this.map);

        // Start location tracking
        this.location.start();
        this.bridgeStore.load();
    }


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
        const R = 6371000; // meters

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

}
