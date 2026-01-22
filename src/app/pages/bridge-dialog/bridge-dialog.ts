import { AfterViewInit, Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Bridge } from '../../models/bridge.model';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe } from '@angular/common';
import { AuthStore } from '../../store/auth.store';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-bridge-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './bridge-dialog.html',
})
export class BridgeDialog {

    authStore = inject(AuthStore)
    iframeUrl: SafeResourceUrl
    iframeWidth: string = '100%';
    iframeHeight: string = '100%';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Bridge,
        private sanitizer: DomSanitizer
    ) {
        console.log(data)
        this.setIframeUrl();
    }

    setIframeUrl() {
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.publicUrl);
    }


    // @ViewChild('content') content!: ElementRef<HTMLElement>;

    // ngAfterViewInit() {
    //     const height = this.content.nativeElement.scrollHeight;
    //     console.log('mat-dialog-content height:', height);
    //     this.iframeHeight = `${height}px`
    // }

}
