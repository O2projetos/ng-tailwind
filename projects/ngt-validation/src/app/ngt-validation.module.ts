import {NgModule} from '@angular/core';
import {NgtValidationComponent} from './ngt-validation.component';
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        NgtValidationComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        NgtValidationComponent
    ]
})
export class NgtValidationModule {
}
