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

    private unsubscribe?: () => void;

    load() {
        this._loading.set(true);

        const ref = collection(firestore, 'bridges');

        this.unsubscribe = onSnapshot(
            ref,
            snapshot => {
                this._bridges.set(
                    snapshot.docs.map(d => ({
                        id: d.id,
                        ...d.data(),
                    })) as Bridge[]
                );
                this._loading.set(false);
            },
            () => {
                this._error.set('Failed to load bridges');
                this._loading.set(false);
            }
        );
    }


    async update(current: Bridge) {
        console.log(current)
        if (!current.id) return;

        return await updateDoc(
            doc(firestore, 'bridges', current.id),
            {
                name: current.name,
                slug: current.slug,
                lat: current.lat,
                lng: current.lng,
                description: current.description,
                imageUrl: current.imageUrl ? current.imageUrl : null
            }
        );
    }

    async add(current: Bridge) {
        await addDoc(collection(firestore, 'bridges'), {
            name: current.name,
            slug: current.slug,
            lat: current.lat,
            lng: current.lng,
            description: current.description,
            imageUrl: current.imageUrl
        });
    }
    async delete(id: string) {
        await deleteDoc(doc(firestore, 'bridges', id));
    }

    destroy() {
        this.unsubscribe?.();
    }
}

