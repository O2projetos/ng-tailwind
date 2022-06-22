import {NgModule} from '@angular/core';
import {NgtFormComponent} from './ngt-form.component';
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        NgtFormComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        NgtFormComponent
    ]
})
export class NgtFormModule {
}
