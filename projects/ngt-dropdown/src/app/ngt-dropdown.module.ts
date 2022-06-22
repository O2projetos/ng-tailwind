import {NgModule} from '@angular/core';
import {NgtDropdownComponent} from './ngt-dropdown.component';
import {CommonModule} from "@angular/common";
import {NgtDropdownContainerComponent} from "./ngt-dropdown-container/ngt-dropdown-container.component";

@NgModule({
    declarations: [
        NgtDropdownComponent,
        NgtDropdownContainerComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        NgtDropdownComponent,
        NgtDropdownContainerComponent
    ]
})
export class NgtDropdownModule {
}
