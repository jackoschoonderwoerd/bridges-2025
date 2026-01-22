import { Component, inject, OnInit, output, Signal, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { BridgeStore } from '../../store/brigde.store';
import { Bridge } from '../../models/bridge.model';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './../../../main';
import { QuillTextEditor } from '../../shared/quill/quill-text-editor';

@Component({
    selector: 'app-add-bridge',
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInput,
        FormsModule,
        MatIconModule,
        QuillTextEditor
    ],
    templateUrl: './add-bridge.html',
    styleUrl: './add-bridge.scss',
})
export class AddBridge implements OnInit {
    form: FormGroup;
    fb = inject(FormBuilder);
    editmode = signal<boolean>(false)
    id = signal<string>('');
    router = inject(Router);
    route = inject(ActivatedRoute);
    bridgeStore = inject(BridgeStore);
    imageUrl = signal<string>('');
    selectedFile = signal<File>(null);
    current = signal<Bridge | null>(null);
    imagePreview = signal<string | null>(null);
    description = signal<string>(null)
    // textOut = output<string>();


    constructor() {
        this.initForm()
        const id = this.route.snapshot.paramMap.get('id')
        if (!id) {
            this.editmode.set(false)
        } else {
            this.id.set(this.route.snapshot.paramMap.get('id'))
            this.editmode.set(true)
            this.current.set(this.bridgeStore.bridges().find(b => b.id === id));
            if (this.current()) {

                this.description.set(this.current().description)
            }
            this.patchForm()
        }
    }

    ngOnInit(): void {

    }

    initForm() {
        this.form = this.fb.group({
            name: new FormControl('', [Validators.required]),
            slug: new FormControl('', [Validators.required]),
            lat: new FormControl(null, [Validators.required]),
            lng: new FormControl(null, [Validators.required]),
            publicUrl: new FormControl(null)
            // description: new FormControl('', [Validators.required]),

        })
    }

    patchForm() {
        // console.log(this.current())
        this.form.patchValue({
            name: this.current().name ? this.current().name : null,
            slug: this.current().slug ? this.current().slug : null,
            lat: this.current().lat ? this.current().lat : null,
            lng: this.current().lng ? this.current().lng : null,
            publicUrl: this.current().publicUrl ? this.current().publicUrl : null
            // description: this.current().description ? this.current().description : null,
        })

    }

    async onSaveBridge() {
        let current: Bridge = {
            ...this.form.value,
            imageUrl: this.current().imageUrl,
            id: this.id(),
            description: this.description()
        }

        if (this.selectedFile()) {
            const filePath = `bridges/${this.selectedFile().name}`
            const fileRef = ref(storage, filePath)
            await uploadBytes(fileRef, this.selectedFile())
            current.imageUrl = await getDownloadURL(fileRef)
        }


        if (!this.editmode) {
            this.bridgeStore.add(current);
        } else {
            this.bridgeStore.update(current)
                .then((res: any) => {
                    this.router.navigateByUrl('admin')
                });
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return

        const file = input.files[0]
        this.selectedFile.set(input.files[0])

        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview.set(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    onDeleteImage() {
        this.imagePreview.set(null);
        this.current().imageUrl = '';
    }


    onClear() {
        this.form.reset();
    }

    onCancel() {
        this.onClear()
        this.router.navigateByUrl('admin')
    }

    onValueChange(description: string) {
        this.description.set(description)
    }
}
