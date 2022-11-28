import {Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

// import * as screenfull from 'screenfull';

@Directive({
    selector: '[appScreenFull]'
})
export class FullScreenDirective implements OnChanges, OnInit {
    @Input('appScreenFull') public fullscreenState: boolean;

    public constructor(private el: ElementRef) { }

    public ngOnChanges(changes: SimpleChanges) {
        // tslint:disable-next-line: no-string-literal
        if (!changes['fullscreenState'].isFirstChange()) {
            if (this.fullscreenState) {
                const element: any = this.el.nativeElement;

                // tslint:disable-next-line: max-line-length
                const requestMethod = element.requestFullscreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

                if (requestMethod) { // Native full screen.
                    requestMethod.call(element);
                } else {
                    console.log('FullScreen Request Method Not Supported on this browser.');
                }
            } else {
                const element: any = document;

                // tslint:disable-next-line: max-line-length
                const requestMethod = element.cancelFullscreen || element.webkitExitFullscreen || element.webkitCancelFullScreen || element.mozCancelFullScreen || element.msExitFullScreen;

                if (requestMethod) { // Native Cancel full screen.
                    requestMethod.call(element);
                } else {
                    console.log('FullScreen Cancel Request Method Not Supported on this browser.');
                }
            }
        }
    }

    public ngOnInit() {
    }
}
