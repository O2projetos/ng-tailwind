import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    NgtAttachmentHttpService,
    NgtDateModule,
    NgtDatepickerModule,
    NgtFormModule,
    NgtHttpFormService,
    NgtHttpService,
    NgtSelectModule,
    NgtStylizableModule,
    NgtSvgModule,
    NgtTranslateService
} from 'projects/ng-tailwind/src/public-api';

import {NgtHttpFormTestService} from './services/ngt-http-form-test.service';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeModule} from './pages/home/home.module';
import {NgtAttachmentHttpServiceTest} from './services/ngt-attachment-http-test.service';
import {NgtHttpTest} from './services/ngt-http-test.service';
import {NgtTranslateDefaultService} from './services/ngt-translate-default.service';
import {FormsModule} from "@angular/forms";
import {
    NgtDatepickerOptionsService
} from "../../projects/ng-tailwind/src/components/ngt-datepicker/ngt-datepicker-options.service";
import {NgtDatepickerOptionsProvider} from "./services/ngt-datepicker-options.provider";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HomeModule,
        NgtSvgModule,
        NgtStylizableModule,
        NgtDateModule,
        NgtDatepickerModule,
        NgtFormModule,
        FormsModule,
        NgtSelectModule
    ],
    providers: [
        {
            provide: NgtHttpFormService,
            useClass: NgtHttpFormTestService
        },
        {
            provide: NgtHttpService,
            useClass: NgtHttpTest
        },
        {
            provide: NgtAttachmentHttpService,
            useClass: NgtAttachmentHttpServiceTest
        },
        {
            provide: NgtTranslateService,
            useClass: NgtTranslateDefaultService
        },
        {
            provide: NgtDatepickerOptionsService,
            useClass: NgtDatepickerOptionsProvider
        },
        {
            provide: 'NgtThStyle',
            useValue: {
                color: {
                    bg: 'bg-gray-200',
                },
                py: 'py-2',
                px: 'px-4',
                font: 'font-bold',
                text: 'text-sm',
                border: 'border-b',
            }
        },
        {
            provide: 'NgtThCheckStyle',
            useValue: {
                py: 'py-2',
                px: 'px-4',
                border: 'border-b',
                text: 'text-center',
                color: {
                    border: ''
                }
            }
        },
        {
            provide: 'NgtTdCheckStyle',
            useValue: {
                py: 'py-2',
                px: 'px-4',
                border: 'border-b',
                break: 'break-words',
                color: {
                    border: ''
                }
            }
        },
        {
            provide: 'NgtTdStyle',
            useValue: {
                py: 'py-2',
                px: 'px-4',
                border: 'border-b',
                break: 'break-words',
                color: {
                    text: '',
                    bg: '',
                    border: ''
                }
            }
        },
        {
            provide: 'NgtPortletStyle',
            useValue: {
                color: {
                    bg: 'bg-white',
                    text: 'text-gray-800'
                },
                mx: 'mx-3 md:mx-6',
                my: 'my-8',
                h: 'h-auto',
                shadow: 'shadow-lg'
            }
        },
        {
            provide: 'NgtPortletFooterStyle',
            useValue: {
                color: {
                    bg: 'bg-gray-200',
                    text: 'text-gray-800'
                }
            }
        },
        {
            provide: 'NgtPortletBodyStyle',
            useValue: {
                color: {
                    text: 'text-gray-800'
                }
            }
        },
        {
            provide: 'NgtActionStyle',
            useValue: {
                color: {
                    bg: 'bg-none hover:bg-teal-600',
                    text: 'text-gray-800 hover:text-white text-2xl',
                },
                h: 'h-10',
                w: 'w-10'
            }
        },
        {
            provide: 'NgtDatepickerInputStyle',
            useValue: {
                h: 'h-12',
                text: 'text-xs',
                border: 'border',
                fontCase: 'uppercase font-semibold',
                rounded: 'rounded',
                color: {
                    text: 'text-gray-600',
                    border: 'border-gray-400'
                }
            }
        },
        {
            provide: 'NgtDatepickerStyle',
            useValue: {
                text: 'text-base',
                fontCase: '',
                border: 'border',
                color: {
                    text: 'text-gray-800',
                    bg: 'bg-white',
                    border: 'border-gray-300'
                }
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
