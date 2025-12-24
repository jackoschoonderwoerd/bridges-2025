import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-dialog',
    imports: [MatButtonModule, MatDialogModule],
    templateUrl: './confirm-dialog.html',
    styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
    private dialogRef = inject(MatDialogRef<ConfirmDialog>);
    data = inject(MAT_DIALOG_DATA) as { message: string };

    cancel() {
        this.dialogRef.close(false);
    }

    confirm() {
        this.dialogRef.close(true);
    }
}
