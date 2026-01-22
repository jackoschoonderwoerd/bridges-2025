import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class RouteControlService {

    showRoute = signal(false);

    toggle() {
        this.showRoute.update(v => !v);
    }

    disable() {
        this.showRoute.set(false);
    }
}
