import {NgModule} from '@angular/core';
import {NgtDatepickerComponent} from "./ngt-datepicker.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgtHelperModule} from "@o2projetos/ngt-helper";
import {NgtValidationModule} from "@o2projetos/ngt-validation";

@NgModule({
    declarations: [
        NgtDatepickerComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgtHelperModule,
        NgtValidationModule,
    ],
    exports: [
        NgtDatepickerComponent
    ]
})
export class NgtDatepickerModule {
}
