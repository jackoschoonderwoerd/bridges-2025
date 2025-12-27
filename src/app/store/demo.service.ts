import { Injectable, signal, computed } from '@angular/core';
import { Bridge } from '../models/bridge.model';

@Injectable({ providedIn: 'root' })
export class DemoService {
    enabled = signal(false);

    bridges = signal<Bridge[]>([]);
    index = signal(0);

    currentBridge = computed(() => {
        const list = this.bridges();
        if (!list.length) return null;
        return list[this.index() % list.length];
    });

    start(bridges: Bridge[]) {
        this.bridges.set(bridges);
        this.index.set(0);
        this.enabled.set(true);
    }

    stop() {
        this.enabled.set(false);
    }

    next() {
        this.index.update(i => i + 1);
    }
}
