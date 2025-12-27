import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Bridge } from '../../models/bridge.model';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe } from '@angular/common';
import { AuthStore } from '../../store/auth.store';

@Component({
    selector: 'app-bridge-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, JsonPipe],
    templateUrl: './bridge-dialog.html',
})
export class BridgeDialog {

    authStore = inject(AuthStore)

    constructor(@Inject(MAT_DIALOG_DATA) public data: Bridge) { }
}
