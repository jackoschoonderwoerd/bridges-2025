import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../../environments/environment.prod';
// import { firebaseConfig } from '../environments/environment.prod'; // adjust path if needed

export interface GeoJSONFeature {
    type: 'Feature';
    geometry: { type: 'Point'; coordinates: [number, number] };
    properties: {
        name: string;
        slug: string;
        description?: string;
    };
}

export interface GeoJSON {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

@Injectable({ providedIn: 'root' })
export class BridgeImportService {
    private app = initializeApp(firebaseConfig);
    private db = getFirestore(this.app);

    constructor() { }

    async importGeoJSON(geojson: GeoJSON) {
        const batch = writeBatch(this.db);
        const bridgesCollection = collection(this.db, 'bridges');

        geojson.features.forEach(feature => {
            const { slug, name, description } = feature.properties;
            const [lng, lat] = feature.geometry.coordinates;
            const bridgeDoc = doc(bridgesCollection, slug); // Use slug as doc ID
            batch.set(bridgeDoc, { name, slug, description, lat, lng });
        });

        await batch.commit();
        console.log(`Imported ${geojson.features.length} bridges successfully!`);
    }
}
