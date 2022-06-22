import {NgModule} from '@angular/core';
import {NgtSvgComponent} from './ngt-svg.component';
import {AngularSvgIconModule} from "angular-svg-icon";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {NgtStylizableModule} from "@o2projetos/ngt-stylizable";

@NgModule({
    declarations: [
        NgtSvgComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        AngularSvgIconModule.forRoot(),
        NgtStylizableModule
    ],
    exports: [
        NgtSvgComponent
    ]
})
export class NgtSvgModule { }
