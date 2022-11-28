import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgxDropzoneModule} from 'ngx-dropzone';

import {NgtHelperModule} from '../ngt-helper/ngt-helper.module';
import {NgtSvgModule} from '../ngt-svg/ngt-svg.module';
import {NgtValidationModule} from '../ngt-validation/ngt-validation.module';
import {CustomDropzonePreviewComponent} from './custom-dropzone-preview/custom-dropzone-preview.component';
import {NgtDropzoneFileViewerComponent} from './ngt-dropzone-file-viewer/ngt-dropzone-file-viewer.component';
import {NgtDropzoneViewComponent} from './ngt-dropzone-view/ngt-dropzone-view.component';
import {NgtDropzoneComponent} from './ngt-dropzone.component';
import {FullScreenDirective} from "./ngt-dropzone-image-viewer/ngt-dropzone-image-viewer.directive";
import {NgtDropzoneImageViewerComponent} from "./ngt-dropzone-image-viewer/ngt-dropzone-image-viewer.component";
import {NgtActionModule} from "../ngt-action/ngt-action.module";
import {NgtStylizableModule} from "../../directives/ngt-stylizable/ngt-stylizable.module";

import {NgxDocViewerModule} from "ngx-doc-viewer";

@NgModule({
    exports: [NgtDropzoneComponent],
    declarations: [
        NgtDropzoneComponent,
        NgtDropzoneFileViewerComponent,
        NgtDropzoneViewComponent,
        CustomDropzonePreviewComponent,
        FullScreenDirective,
        NgtDropzoneImageViewerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgtValidationModule,
        NgxDropzoneModule,
        NgtSvgModule,
        NgtHelperModule,
        NgtActionModule,
        NgtStylizableModule,
        NgxDocViewerModule,
    ]
})
export class NgtDropzoneModule { }
