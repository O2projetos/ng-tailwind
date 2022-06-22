import {NgModule} from '@angular/core';
import {NgtStylizableDirective} from "./ngt-stylizable.directive";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [NgtStylizableDirective],
    exports: [NgtStylizableDirective],
    imports: [
        CommonModule
    ]
})
export class NgtStylizableModule {
}
