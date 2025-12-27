import { JsonPipe } from '@angular/common';
import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';

@Component({
    selector: 'app-quill-text-editor',
    imports: [QuillModule],
    templateUrl: './quill-text-editor.html',
    styleUrl: './quill-text-editor.scss',
})
export class QuillTextEditor {
    valueChange = output<string>();

    textIn = input<string>('');

    editorRef = viewChild<ElementRef>('editor');

    private quillReady = signal(false);

    quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ header: [1, 2, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
        ],
    };

    private quill!: Quill;

    constructor() {

        const incoming = this.textIn();
        effect(() => {
            const ready = this.quillReady();

            if (!ready || !incoming) return;

            const current = this.quill.root.innerHTML;
            if (current !== incoming) {
                this.quill.clipboard.dangerouslyPasteHTML(this.textIn());
            }
        });
    }

    ngAfterViewInit() {
        // if (this.textIn()) {
        //     console.log(this.textIn())
        //     this.quill.clipboard.dangerouslyPasteHTML(this.textIn());
        // }
        this.quill = new Quill(this.editorRef().nativeElement, { theme: 'snow' });
        // console.log(this.textIn())
        this.quill.clipboard.dangerouslyPasteHTML(this.textIn());

        this.quill.on('text-change', () => {
            const html = this.quill.root.innerHTML;
            this.valueChange.emit(html);
        });
        this.quillReady.set(true); // ✅ THIS replaces the timeout
    }

}
