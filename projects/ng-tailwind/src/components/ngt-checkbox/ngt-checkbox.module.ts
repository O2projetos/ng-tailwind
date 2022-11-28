import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {NgtShiningModule} from '../ngt-shining/ngt-shining.module';
import {NgtCheckboxComponent} from './ngt-checkbox.component';
import {NgtHelperModule} from "../ngt-helper/ngt-helper.module";
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [NgtCheckboxComponent],
    exports: [NgtCheckboxComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgtShiningModule,
        NgtHelperModule,
    ]
})
export class NgtCheckboxModule { }
