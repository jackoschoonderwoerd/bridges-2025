import { Component } from '@angular/core';


import { BridgeImportService } from '../../core/bridge-import.service';
import { bridgesGeoJSON } from '../../core/bridges.geojson';

@Component({
    selector: 'app-import-bridges',
    template: `<button (click)="importBridges()">Import Bridges</button>`
})
export class ImportBridges {
    constructor(private bridgeImport: BridgeImportService) { }

    importBridges() {
        this.bridgeImport.importGeoJSON(bridgesGeoJSON)
            .then(() => console.log('All bridges imported!'))
            .catch(err => console.error(err));
    }
}
