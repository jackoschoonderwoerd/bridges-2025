import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { QRCodeComponent } from 'angularx-qrcode';

import { map } from 'rxjs/operators';
import { BridgeStore } from '../../store/brigde.store';

@Component({
    selector: 'app-bridge-detail',
    standalone: true,
    imports: [QRCodeComponent],
    templateUrl: './bridge-detail.html',
    styleUrl: './bridge-detail.scss',
})
export class BridgeDetail {
    private route = inject(ActivatedRoute);
    private bridgeStore = inject(BridgeStore);

    // ✅ reactive route param
    private slug = toSignal(
        this.route.paramMap.pipe(map(p => p.get('slug'))),
        { initialValue: null }
    );

    // ✅ computed bridge from Firestore-backed store
    bridge = computed(() => {
        const slug = this.slug();
        if (!slug) return null;

        return this.bridgeStore.bridges().find(b => b.slug === slug) ?? null;
    });

    qrUrl(slug: string) {
        return `${location.origin}/bridge/${slug}`;
    }
}


// import { Component, computed, inject } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

// import { QRCodeComponent } from 'angularx-qrcode';

// @Component({
//     selector: 'app-bridge-detail',
//     standalone: true,
//     imports: [QRCodeComponent],

//     templateUrl: './bridge-detail.html',
//     styleUrl: './bridge-detail.scss',
// })
// export class BridgeDetail {
//     private route = inject(ActivatedRoute);

//     bridge = computed(() => {
//         const slug = this.route.snapshot.paramMap.get('slug');
//         return BRIDGES.find(b => b.slug === slug) ?? null;
//     });

//     qrUrl(slug: string) {
//         return `${location.origin}/bridge/${slug}`;
//     }
// }
