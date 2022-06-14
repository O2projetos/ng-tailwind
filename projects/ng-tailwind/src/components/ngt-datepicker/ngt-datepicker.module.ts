import {NgModule} from '@angular/core';
import {NgtDatepickerComponent} from "./ngt-datepicker.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgtHelperModule} from "../ngt-helper/ngt-helper.module";
import {NgtValidationModule} from "../ngt-validation/ngt-validation.module";

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
