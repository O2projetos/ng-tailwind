import {
    AfterViewChecked,
    Component,
    ElementRef,
    Injector,
    Input,
    OnChanges,
    Optional,
    Self,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {SvgIconComponent} from "angular-svg-icon";
import {NgtStylizableDirective, NgtStylizableService} from "@o2projetos/ngt-stylizable";

@Component({
    selector: 'ngt-svg',
    templateUrl: './ngt-svg.component.html',
    styleUrls: ['./ngt-svg.component.css'],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'flex justify-center'
    },
})
export class NgtSvgComponent implements AfterViewChecked, OnChanges {
    @Input() public src: string;
    @Input() public class: string = '';
    @Input() public isAction: boolean;
    @Input() public isDisabled: boolean;

    @ViewChild(SvgIconComponent, { static: true, read: ElementRef }) private svgIconElement: ElementRef;

    public ngtStyle: NgtStylizableService;
    private appliedClass: string = '';

    public constructor(
        private injector: Injector,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        this.loadNgtStylizable();
    }

    public get ngtStyleCompile(): string {
        return this.ngtStyle.compile(['h', 'w', 'color.bg', 'color.text', 'px', 'py', 'p', 'shadow', 'text', 'border', 'color.border']);
    }

    public ngAfterViewChecked(): void {
        this.checkClassChange();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.class) {
            this.checkClassChange();
        }
    }

    public onClick(event: Event) {
        if (this.isDisabled) {
            event.stopPropagation();
        }
    }

    private checkClassChange(): void {
        if (this.appliedClass !== this.class) {
            if (this.svgIconElement && this.svgIconElement.nativeElement) {
                let svgElement = <SVGAElement>this.svgIconElement.nativeElement.querySelector('svg');

                if (svgElement) {
                    while (svgElement.classList.length > 0) {
                        svgElement.classList.remove(svgElement.classList.item(0));
                    }

                    svgElement.classList.add('fill-current');
                    svgElement.classList.add('self-center');

                    String(this.class).trim().split(' ').forEach(className => {
                        if (className) {
                            svgElement.classList.add(className);
                        }
                    });

                    this.appliedClass = this.class;
                }
            }
        }
    }

    private loadNgtStylizable(): void {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtSvg', {
            h: 'h-full',
            w: 'w-full',
            color: {
                bg: 'bg-transparent',
                text: 'text-gray-800',
                border: '',
            },
            text: 'text-xl',
            border: 'border-0',
        });
    }
}
