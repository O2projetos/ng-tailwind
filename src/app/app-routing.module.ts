import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './pages/home/home.component';

const routes: Routes = [
    {
        "path": "docs",
        "component": HomeComponent,
        "children": [
            {
                "path": "",
                "redirectTo": "installation",
                "pathMatch": "full"
            },

            /** Getting Started */
            {
                "path": "installation",
                "loadChildren": () => import('src/app/pages/getting-started/installation/installation.module').then(m => m.InstallationModule)
            },
            {
                "path": "release-notes",
                "loadChildren": () => import('src/app/pages/getting-started/release-notes/release-notes.module').then(m => m.ReleaseNotesModule)
            },

            /** Action Components */
            {
                "path": "ngt-action",
                "loadChildren": () => import('src/app/pages/action-components/ngt-action-page/ngt-action-page.module').then(m => m.NgtActionPageModule)
            },
            {
                "path": "ngt-button",
                "loadChildren": () => import('src/app/pages/action-components/ngt-button-page/ngt-button-page.module').then(m => m.NgtButtonPageModule)
            },
            {
                "path": "ngt-floating-button",
                "loadChildren": () => import('src/app/pages/action-components/ngt-floating-button-page/ngt-floating-button-page.module').then(m => m.NgtFloatingButtonPageModule)
            },

            /** Form Components */
            {
                "path": "ngt-checkbox",
                "loadChildren": () => import('src/app/pages/form-components/ngt-checkbox-page/ngt-checkbox-page.module').then(m => m.NgtCheckboxPageModule)
            },
            {
                "path": "ngt-dropzone",
                "loadChildren": () => import('src/app/pages/form-components/ngt-dropzone-page/ngt-dropzone-page.module').then(m => m.NgtDropzonePageModule)
            },
            {
                "path": "ngt-form",
                "loadChildren": () => import('src/app/pages/form-components/ngt-form-page/ngt-form-page.module').then(m => m.NgtFormPageModule)
            },
            {
                "path": "ngt-input",
                "loadChildren": () => import('src/app/pages/form-components/ngt-input-page/ngt-input-page.module').then(m => m.NgtInputPageModule)
            },
            {
                "path": "ngt-select",
                "loadChildren": () => import('src/app/pages/form-components/ngt-select-page/ngt-select-page.module').then(m => m.NgtSelectPageModule)
            },
            {
                "path": "ngt-textarea",
                "loadChildren": () => import('src/app/pages/form-components/ngt-textarea-page/ngt-textarea-page.module').then(m => m.NgtTextareaPageModule)
            },

            /** Layout Components */
            {
                "path": "ngt-dropdown",
                "loadChildren": () => import('src/app/pages/layout-components/ngt-dropdown-page/ngt-dropdown-page.module').then(m => m.NgtDropdownPageModule)
            },

            /** Table Components */
            // {
            //   "path": "ngt-datatable",
            //   "loadChildren": () => import('src/app/pages/table-components/ngt-datatable-page/ngt-datatable-page.module').then(m => m.NgtDatatablePageModule)
            // }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
