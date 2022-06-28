import {NgModule} from '@angular/core';
import {NgtHelperComponent} from './ngt-helper.component';
import {CommonModule} from "@angular/common";
import {NgtDropdownModule} from "@o2projetos/ngt-dropdown";
import {NgtSvgModule} from "@o2projetos/ngt-svg";

@NgModule({
    declarations: [
        NgtHelperComponent
    ],
    imports: [
        CommonModule,
        NgtDropdownModule,
        NgtSvgModule
    ],
    exports: [
        NgtHelperComponent
    ]
})
export class NgtHelperModule {
}
