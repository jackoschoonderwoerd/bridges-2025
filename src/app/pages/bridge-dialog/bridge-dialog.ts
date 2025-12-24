import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Bridge } from '../../models/bridge.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-bridge-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './bridge-dialog.html',
})
export class BridgeDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data: Bridge) { }
}
