import {NgModule} from '@angular/core';
import {NgtDatepickerComponent} from "./ngt-datepicker.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        NgtDatepickerComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    exports: [
        NgtDatepickerComponent
    ]
})
export class NgtDatepickerModule {
}
