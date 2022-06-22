import {Component, Injector, Input, Optional} from '@angular/core';
import {AbstractControl, ControlContainer, FormControl} from "@angular/forms";
import {NgtValidationTranslateProvider, NgtValidationTranslateService} from "./ngt-validation.service";

@Component({
    selector: 'ngt-validation',
    templateUrl: 'ngt-validation.component.html'
})
export class NgtValidationComponent {
    @Input() public control: FormControl | AbstractControl;
    @Input() public container: ControlContainer;
    @Input() public minValue: number;
    @Input() public minLength: number;

    public constructor(
        @Optional()
        public ngtValidationTranslateService: NgtValidationTranslateService,
        public injector: Injector
    ) {
        if (!ngtValidationTranslateService) {
            this.ngtValidationTranslateService = injector.get(NgtValidationTranslateProvider);
        }
    }
}
