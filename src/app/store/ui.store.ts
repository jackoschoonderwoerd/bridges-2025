import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiStore {
    readonly route = signal<string | null>(null);

    setRoute(route: string) {
        console.log(route)
        this.route.set(route);
    }
}
