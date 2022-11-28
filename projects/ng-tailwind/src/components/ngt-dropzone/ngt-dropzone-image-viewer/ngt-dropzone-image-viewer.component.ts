import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    SkipSelf,
    ViewEncapsulation
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DefaultNgtDropzoneImageViewerConfig, ImageViewerConfig} from "./ngt-dropzone-image-viewer.meta";
import {NgtDropzoneFileViewerComponent} from "../ngt-dropzone-file-viewer/ngt-dropzone-file-viewer.component";

@Component({
    selector: 'ngt-dropzone-image-viewer',
    templateUrl: './ngt-dropzone-image-viewer.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class NgtDropzoneImageViewerComponent implements AfterViewInit, OnChanges {
    @Input() public src: string[];
    @Input() public screenHeightOccupied: 0;
    @Input() public index = 0;
    @Input() public config: ImageViewerConfig = DefaultNgtDropzoneImageViewerConfig;

    @Output() public indexChange: EventEmitter<number> = new EventEmitter();
    @Output() public configChange: EventEmitter<ImageViewerConfig> = new EventEmitter();

    public styleHeight = '100%';

    public style = {transform: '', msTransform: '', oTransform: '', webkitTransform: ''};
    public fullscreen = false;
    public loading = true;
    private scale = 1;
    private rotation = 0;
    private translateX = 0;
    private translateY = 0;
    private prevX: number;
    private prevY: number;
    private hovered = false;

    public constructor(
        @SkipSelf()
        private ngtDropzoneFileViewerComponent: NgtDropzoneFileViewerComponent,
        private changeDetectorRef: ChangeDetectorRef,
        private sanitizer: DomSanitizer
    ) {
    }

    @HostListener('mouseover')
    public onMouseOver() {
        this.hovered = true;
    }

    @HostListener('mouseleave')
    public onMouseLeave() {
        this.hovered = false;
    }

    @HostListener('window:keyup.ArrowRight', ['$event'])
    public nextImage(event) {
        if (this.canNavigate(event) && this.index < this.src.length - 1) {
            this.loading = true;
            this.index++;
            this.triggerIndexBinding();
            this.reset();
        }
    }

    @HostListener('window:keyup.ArrowLeft', ['$event'])
    public prevImage(event) {
        if (this.canNavigate(event) && this.index > 0) {
            this.loading = true;
            this.index--;
            this.triggerIndexBinding();
            this.reset();
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.screenHeightOccupied) {
            this.styleHeight = 'calc(100% - ' + this.screenHeightOccupied + 'px)';
        }
    }

    public ngAfterViewInit() {
        this.triggerConfigBinding();
        this.changeDetectorRef.detectChanges();
    }

    public zoomIn() {
        this.scale *= (1 + this.config.zoomFactor);
        this.updateStyle();
    }

    public zoomOut() {
        if (this.scale > this.config.zoomFactor) {
            this.scale /= (1 + this.config.zoomFactor);
        }

        this.updateStyle();
    }

    public scrollZoom(evt) {
        if (this.config.wheelZoom) {
            return evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
        }
    }

    public rotateClockwise() {
        this.rotation += 90;
        this.updateStyle();
    }

    public rotateCounterClockwise() {
        this.rotation -= 90;
        this.updateStyle();
    }

    public onLoad(url) {
        this.loading = false;
    }

    public onLoadStart(url) {
        this.loading = true;
    }

    public imageNotFound(url) {
    }

    public onDragOver(evt) {
        this.translateX += (evt.clientX - this.prevX);
        this.translateY += (evt.clientY - this.prevY);
        this.prevX = evt.clientX;
        this.prevY = evt.clientY;
        this.updateStyle();
    }

    public onDragStart(evt) {
        if (evt.dataTransfer && evt.dataTransfer.setDragImage) {
            evt.dataTransfer.setDragImage(evt.target.nextElementSibling, 0, 0);
        }

        this.prevX = evt.clientX;
        this.prevY = evt.clientY;
    }

    public toggleFullscreen() {
        this.fullscreen = !this.fullscreen;

        if (!this.fullscreen) {
            this.reset();
        }
    }

    public triggerIndexBinding() {
        this.indexChange.emit(this.index);
    }

    public triggerConfigBinding() {
        this.configChange.next(this.config);
    }

    public reset() {
        this.scale = 1;
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.updateStyle();
    }

    public download(index: number): void {
        let file = document.createElement("a");

        file.target = '_blank';
        file.href = this.src[index].replace('preview', 'download');
        file.setAttribute("download", this.ngtDropzoneFileViewerComponent.resource?.name);
        file.click();
    }

    private canNavigate(event: any) {
        return event == null || (this.config.allowKeyboardNavigation && this.hovered);
    }

    private updateStyle() {
        this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
        this.style.msTransform = this.style.transform;
        this.style.webkitTransform = this.style.transform;
        this.style.oTransform = this.style.transform;
    }
}
