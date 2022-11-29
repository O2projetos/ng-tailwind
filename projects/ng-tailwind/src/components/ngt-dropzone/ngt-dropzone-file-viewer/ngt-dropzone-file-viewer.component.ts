import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgtDropzoneFile} from "../ngt-dropzone.component";

@Component({
    selector: 'ngt-dropzone-file-viewer',
    styleUrls: ['./ngt-dropzone-file-viewer.component.css'],
    templateUrl: './ngt-dropzone-file-viewer.component.html'
})
export class NgtDropzoneFileViewerComponent {
    @Input() public url: string = '';
    @Input() public resource;

    @Output() public onClose: EventEmitter<void> = new EventEmitter();

    public canShowViewer: boolean = true;
    public loading: boolean;

    @HostListener('window:keydown', ['$event'])
    public keyEvent(event: KeyboardEvent) {
        if (event.code == 'Escape') {
            this.close();
        }
    }

    public init(url, resource: NgtDropzoneFile): void {
        this.url = url;
        this.resource = resource;

        this.loading = true;
        this.canShowViewer = true;
    }

    public isImage() {
        console.log(this.resource);

        return this.resource?.mimeType?.includes('image');
    }

    public close(): void {
        this.canShowViewer = false;
        this.onClose.emit();
    }
}
