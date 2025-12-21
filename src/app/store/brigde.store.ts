import { Injectable, signal, computed } from '@angular/core';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getFirestore,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './../../environments/environment.prod';
import { Bridge } from '../models/bridge.model';

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

@Injectable({ providedIn: 'root' })
export class BridgeStore {
    private readonly _bridges = signal<Bridge[]>([]);
    private readonly _loading = signal(true);
    private readonly _error = signal<string | null>(null);

    readonly bridges = this._bridges.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    readonly hasBridges = computed(() => this._bridges().length > 0);

    private unsubscribe?: () => void;

    load() {
        this._loading.set(true);
        this._error.set(null);

        const ref = collection(firestore, 'bridges');

        this.unsubscribe = onSnapshot(
            ref,
            snapshot => {
                const bridges = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Bridge[];

                this._bridges.set(bridges);
                this._loading.set(false);
            },
            () => {
                this._error.set('Failed to load bridges');
                this._loading.set(false);
            }
        );
    }

    async add(bridge: Bridge) {
        await addDoc(collection(firestore, 'bridges'), bridge);
    }

    async update(bridge: Bridge) {
        if (!bridge.id) return;
        await updateDoc(doc(firestore, 'bridges', bridge.id), bridge as any);
    }

    async delete(id: string) {
        await deleteDoc(doc(firestore, 'bridges', id));
    }

    destroy() {
        this.unsubscribe?.();
    }
}

// import { Injectable, inject, signal, computed } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Bridge } from '../models/bridge.model';

// @Injectable({ providedIn: 'root' })
// export class BridgeStore {
//     private http = inject(HttpClient);

//     // private writable signals
//     private readonly _bridges = signal<Bridge[] | null>(null);
//     private readonly _loading = signal(false);
//     private readonly _error = signal<string | null>(null);

//     // public readonly signals
//     readonly bridges = this._bridges.asReadonly();
//     readonly loading = this._loading.asReadonly();
//     readonly error = this._error.asReadonly();

//     // derived state
//     readonly hasBridges = computed(() => !!this._bridges()?.length);

//     load() {
//         this._loading.set(true);
//         this._error.set(null);

//         this.http.get<Bridge[]>('/data/bridges.json').subscribe({
//             next: data => {
//                 console.log(data);
//                 this._bridges.set(data);
//                 this._loading.set(false);
//             },
//             error: () => {
//                 this._error.set('Failed to load bridges');
//                 this._loading.set(false);
//             },
//         });
//     }
// }

