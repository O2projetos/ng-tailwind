import {ActivatedRoute} from "@angular/router";
import {Observable, zip} from "rxjs";
import {NgForm} from "@angular/forms";

export enum NgtFormStateEnum {
    CREATING = 'CREATING',
    EDITING = 'EDITING'
}

export function getIdFromUri(route: ActivatedRoute, routeIdentifier: string) {
    return new Observable((observer) => {
        if (!route.params) {
            throw new Error('Invalid Route');
        }

        zip(route.parent.params, route.params)
            .subscribe((results) => {
                let params = {...results[0], ...results[1]};

                observer.next(params[routeIdentifier]);
            });
    });
}

export function resetNgForm(ngForm: NgForm) {
    ngForm.resetForm();
    setTimeout(() => {
        ngForm.reset();
    }, 500);
}

export function triggerNgFormSubmit(ngForm: NgForm) {
    ngForm.onSubmit(new Event("submit"));
}

export function isValidNgForm(ngForm: NgForm) {
    triggerNgFormSubmit(ngForm);

    return ngForm.valid;
}
