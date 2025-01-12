import {AfterViewInit, Component, Input, SimpleChanges, SkipSelf, ViewEncapsulation} from '@angular/core';

import {NgtDropzoneComponent, NgtDropzoneFile, NgtDropzoneFileTypeEnum} from '../ngt-dropzone.component';

@Component({
    selector: 'ngt-dropzone-view',
    templateUrl: './ngt-dropzone-view.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NgtDropzoneViewComponent implements AfterViewInit {
    @Input() public resources: Array<any>;

    public images: Array<NgtDropzoneFile>;
    public audios: Array<NgtDropzoneFile>;
    public videos: Array<NgtDropzoneFile>;
    public files: Array<NgtDropzoneFile>;

    public ngtDropzoneViewFileTypeEnum = NgtDropzoneFileTypeEnum;

    public constructor(
        @SkipSelf()
        public ngtDropzoneComponent: NgtDropzoneComponent
    ) { }

    public ngAfterViewInit() { }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.resources) {
            this.loadFiles();
        }
    }

    public loadFiles() {
        this.images = this.resources.filter((resource) => this.isImage(resource));
        this.audios = this.resources.filter((resource) => this.isAudio(resource));
        this.videos = this.resources.filter((resource) => this.isVideo(resource));
        this.files = this.resources.filter((resource) => this.isFile(resource));
    }

    public getFileType(resource: NgtDropzoneFile): NgtDropzoneFileTypeEnum {
        if (resource.mimeType.includes('.sheet')) {
            return NgtDropzoneFileTypeEnum.XLS;
        }

        if (resource.mimeType.includes('pdf')) {
            return NgtDropzoneFileTypeEnum.PDF;
        }

        if (resource.mimeType.includes('.document')) {
            return NgtDropzoneFileTypeEnum.DOC;
        }

        return NgtDropzoneFileTypeEnum.OTHER;
    }

    private isImage(resource: NgtDropzoneFile) {
        return resource.mimeType.includes('image');
    }

    private isAudio(resource: NgtDropzoneFile) {
        return resource.mimeType.includes('audio');
    }

    private isVideo(resource: NgtDropzoneFile) {
        return resource.mimeType.includes('video');
    }

    private isFile(resource: NgtDropzoneFile) {
        return !this.isImage(resource) && !this.isAudio(resource) && !this.isVideo(resource);
    }
}
