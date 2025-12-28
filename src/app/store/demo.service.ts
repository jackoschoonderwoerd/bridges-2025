import { Injectable, signal, computed } from '@angular/core';
import { Bridge } from '../models/bridge.model';

@Injectable({ providedIn: 'root' })
export class DemoService {
    enabled = signal(false);

    bridges = signal<Bridge[]>([]);
    index = signal(0);

    private timer?: number;

    currentBridge = computed(() => {
        const list = this.bridges();
        if (!list.length) {
            console.log(`!list.length`)
            return null
        };
        return list[this.index() % list.length];
    });

    start(bridges: Bridge[]) {
        console.log('start()')
        this.bridges.set(bridges);
        this.index.set(0);
        this.enabled.set(true);

        this.timer = window.setInterval(() => {
            this.next();
        }, 5000); // 5 seconds per bridge
    }

    stop() {
        console.log('stop')
        this.enabled.set(false);
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    next() {
        this.index.update(i => i + 1);
    }
}
