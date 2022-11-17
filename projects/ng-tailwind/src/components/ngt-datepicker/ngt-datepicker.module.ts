import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgtDatepickerComponent} from "./ngt-datepicker.component";
import {NgtHelperModule} from "../ngt-helper/ngt-helper.module";
import {NgtValidationModule} from "../ngt-validation/ngt-validation.module";
import {NgtDatepickerOptionsService} from "./ngt-datepicker-options.service";
import {NgtShiningModule} from "../ngt-shining/ngt-shining.module";

@NgModule({
    declarations: [
        NgtDatepickerComponent
    ],
    providers: [
        NgtDatepickerOptionsService
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgtHelperModule,
        NgtValidationModule,
        NgtShiningModule,
    ],
    exports: [
        NgtDatepickerComponent
    ]
})
export class NgtDatepickerModule {
}
