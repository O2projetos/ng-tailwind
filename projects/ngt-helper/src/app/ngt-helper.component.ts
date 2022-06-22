import {Component, ElementRef, Injector, Input, Optional, Self, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgtDropdownComponent} from "ngt-dropdown";
import {NgtStylizableDirective, NgtStylizableService} from "@o2projetos/ngt-stylizable";

@Component({
    selector: 'ngt-helper',
    templateUrl: 'ngt-helper.component.html',
    styleUrls: ['ngt-helper.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class NgtHelperComponent {
    @ViewChild(NgtDropdownComponent, { static: true, read: ElementRef }) public dropdownRef: ElementRef;

    @Input() public helpTextColor: string;
    @Input() public helpText: string;
    @Input() public icon: string;
    @Input() public titleIcon: string;

    public ngtStyle: NgtStylizableService;

    public constructor(
        @Optional() @Self()
        public ngtStylizableDirective: NgtStylizableDirective,
        private injector: Injector,
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtHelper', {
            text: 'text-sm',
            fontCase: '',
            color: {
                text: 'text-black',
                bg: 'bg-gray-200'
            }
        });
    }
}
