import { Component, computed, inject, InjectionToken } from '@angular/core';

import { LocationService } from '../../core/location';
import { BRIDGES } from '../../data/bridges';
import { NgIf } from '@angular/common';
import { BridgeMatcherService } from '../../core/bridge-matcher';


@Component({
    selector: 'app-home',
    imports: [NgIf],
    template: `
    <button (click)="start()">Find bridge</button>

    <ng-container *ngIf="bridge() as b">
      <h2>You are probably looking at:</h2>
      <a [routerLink]="['/bridge', b.slug]">
        {{ b.name }}
      </a>
    </ng-container>
  `,
    styleUrl: './home.scss',

})
export class HomeComponent {
    location = inject(LocationService);
    matcher = inject(BridgeMatcherService);

    start() {
        this.location.start();
    }

    bridge = computed(() => {
        const pos = this.location.position();
        if (!pos) return null;

        return this.matcher.findNearest(
            { lat: pos.coords.latitude, lng: pos.coords.longitude },
            BRIDGES
        );
    });
}
