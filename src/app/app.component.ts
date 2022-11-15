import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {
    NgtDatepickerComponent
} from "../../projects/ng-tailwind/src/components/ngt-datepicker/ngt-datepicker.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    @ViewChild(NgtDatepickerComponent) public ngtDatepickerComponent: NgtDatepickerComponent;

    public date = new Date();
    public resource = {};
}
