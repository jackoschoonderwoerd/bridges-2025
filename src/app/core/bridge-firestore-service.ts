import { Injectable, signal } from '@angular/core';
import { firestore } from './../../main';
import {
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    DocumentData
} from 'firebase/firestore';

export interface Bridge {
    id?: string;
    name: string;
    slug: string;
    lat: number;
    lng: number;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class BridgeFirestoreService {
    bridges = signal<Bridge[]>([]);

    private collectionRef = collection(firestore, 'bridges');

    async loadBridges() {
        const snapshot = await getDocs(this.collectionRef);
        this.bridges.set(
            snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bridge))
        );
    }

    async addBridge(bridge: Bridge) {
        console.log(bridge)
        await addDoc(this.collectionRef, bridge as DocumentData);
        await this.loadBridges();
    }

    async updateBridge(bridge: Bridge) {
        if (!bridge.id) return;
        const docRef = doc(firestore, 'bridges', bridge.id);
        await updateDoc(docRef, bridge as DocumentData);
        await this.loadBridges();
    }

    async deleteBridge(id: string) {
        const docRef = doc(firestore, 'bridges', id);
        await deleteDoc(docRef);
        await this.loadBridges();
    }
}
