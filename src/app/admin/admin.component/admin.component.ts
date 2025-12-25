import { Component, computed, inject, signal } from '@angular/core';
// import { BridgeFirestoreService } from '../../core/bridge-firestore-service';
import { Bridge } from '../../models/bridge.model';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
// import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../store/auth.store';
import { ImportBridges } from '../../utils/import-bridges/import-bridges';
import { BridgeStore } from '../../store/brigde.store';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './../../../main';



@Component({
    selector: 'app-admin.component',
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInput,
        MatButtonModule,
        MatIconModule,
        ImportBridges,
        ReactiveFormsModule
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
})
export class AdminComponent {

    bridgeForm: FormGroup;
    fb = inject(FormBuilder);
    id = signal<string>('');
    dialog = inject(MatDialog)
    selectedFile: File | null = null;

    private bridgeStore = inject(BridgeStore);

    bridges = this.bridgeStore.bridges;

    private auth = inject(AuthStore);
    private router = inject(Router);

    constructor() {
        this.bridgeStore.load();
        this.initForm()
    }

    onAddBridge() {
        this.router.navigateByUrl('add-bridge/')
    }

    // bridges = computed(() => this.bridgeService.bridges());



    // async saveBridge() {
    //     const current: Bridge = { ...this.bridgeForm.value }
    //     if (this.id()) {
    //         current.id = this.id()
    //         await this.bridgeStore.update(current)
    //             .then((res: any) => {
    //                 console.log(res);
    //                 this.reset()
    //             });
    //     } else {
    //         await this.bridgeStore.add(current);
    //     }
    //     this.reset();
    // }

    async saveBridge() {

        let current: Bridge = { ...this.bridgeForm.value }
        let imageUrl = current.imageUrl;

        if (this.selectedFile) {
            const filePath = `bridges/${Date.now()}-${this.selectedFile.name}`;
            const fileRef = ref(storage, filePath)

            await uploadBytes(fileRef, this.selectedFile);
            imageUrl = await getDownloadURL(fileRef)
        }
        current = {
            ...current,
            imageUrl
        }

        if (this.id()) {
            console.log(current);

            current.id = this.id()
            await this.bridgeStore.update(current)
                .then((res: any) => {
                    console.log(res);
                    this.reset()
                });
        } else {
            await this.bridgeStore.add(current);
        }
        this.reset();
    }

    async delete(id: string) {
        const ref = this.dialog.open(ConfirmDialog, {
            data: {
                message: 'Are you sure you want to delete this bridge?',
            },
        });

        const confirmed = await ref.afterClosed().toPromise();
        if (!confirmed) return;

        await this.bridgeStore.delete(id);
    }
    // async delete(id: string) {
    //     await this.bridgeStore.delete(id);
    // }



    edit(bridge: Bridge) {
        this.router.navigate(['add-bridge', bridge.id])
        return
        this.id.set(bridge.id)
        this.bridgeForm.patchValue({
            name: bridge.name ? bridge.name : null,
            slug: bridge.slug ? bridge.slug : null,
            lat: bridge.lat ? bridge.lat : null,
            lng: bridge.lng ? bridge.lng : null,
            description: bridge.description ? bridge.description : null,
        })
        // this.current = { ...bridge };
    }


    reset() {
        // this.current = { name: '', slug: '', lat: 0, lng: 0, description: '' };
        this.bridgeForm.reset()
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/admin/login']);
    }

    initForm() {
        this.bridgeForm = this.fb.group({
            name: new FormControl('', [Validators.required]),
            slug: new FormControl('', [Validators.required]),
            lat: new FormControl(null, [Validators.required]),
            lng: new FormControl(null, [Validators.required]),
            description: new FormControl('', [Validators.required])
        })
    }
    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.selectedFile = input.files[0];
        }
    }
}
