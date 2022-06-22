import {Component, EventEmitter, Host, Input, OnDestroy, OnInit, Optional, Output} from '@angular/core';
import {ControlContainer, NgForm} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {getIdFromUri, NgtFormStateEnum} from "./ngt-form.helper";
import {ActivatedRoute, Router} from "@angular/router";
import {NgtHttpFormService} from "./ngt-form.service";

@Component({
    selector: 'ngt-form',
    template: `<ng-content></ng-content>`
})
export class NgtFormComponent implements OnInit, OnDestroy {
    @Input() public guessFormState: boolean = true;
    @Input() public message: string = '';
    @Input() public routeIdentifier: string = 'id';
    @Input() public resource: any;
    @Input() public customLayout: boolean;

    @Output() public static onSubmitInvalidForm: EventEmitter<NgForm> = new EventEmitter;

    @Output() public onCreating: EventEmitter<any> = new EventEmitter;
    @Output() public onEditing: EventEmitter<any> = new EventEmitter;
    @Output() public onLoadingChange: EventEmitter<boolean> = new EventEmitter;
    @Output() public onShiningChange: EventEmitter<boolean> = new EventEmitter;
    @Output() public setupComponent: EventEmitter<any> = new EventEmitter;
    @Output() public onResourceLoadingError: EventEmitter<string> = new EventEmitter;

    public formState: NgtFormStateEnum;
    public uriId: any;

    private loading: boolean;
    private subscriptions: Array<Subscription> = [];

    public constructor(
        @Optional() @Host()
        public formContainer: ControlContainer,
        @Optional() @Host()
        public ngForm: NgForm,
        public router: Router,
        public route: ActivatedRoute,
        private ngtHttpFormService: NgtHttpFormService
    ) {
    }

    public ngOnInit() {
        if (this.guessFormState) {
            this.subscriptions.push(
                this.determineFormState().subscribe(() => {
                    this.setupComponent.emit();
                })
            );
        } else {
            this.setupComponent.emit();
        }

        this.subscriptions.push(
            this.ngForm.ngSubmit.subscribe(() => {
                if (!this.ngForm.valid) {
                    NgtFormComponent.onSubmitInvalidForm.emit(this.ngForm);
                }
            })
        );
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public isCreating() {
        return this.formState === NgtFormStateEnum.CREATING;
    }

    public isEditing() {
        return this.formState === NgtFormStateEnum.EDITING;
    }

    public isLoading() {
        return this.loading;
    }

    public canShowValidationMessage() {
        return this.formContainer &&
            this.formContainer['submitted'] &&
            this.formContainer.status != 'VALID' &&
            this.formContainer.status != 'DISABLED';
    }

    public setLoading(loading: boolean) {
        this.loading = loading;
        this.onLoadingChange.emit(this.loading);
    }

    public setFormState(state: NgtFormStateEnum, triggerChange: boolean = true) {
        this.formState = state;

        if (triggerChange) {
            this.triggerFormStateChange();
        }
    }

    public getFormState() {
        return this.formState;
    }

    public triggerFormStateChange() {
        if (this.isEditing()) {
            this.triggerFormEditing();
        } else if (this.isCreating()) {
            this.triggerFormCreating();
        }
    }

    public formHasChanges() {
        return this.ngForm.dirty;
    }

    protected triggerFormCreating() {
        this.onCreating.emit();
    }

    protected triggerFormEditing() {
        if (this.uriId && this.resource) {
            this.setLoading(true);

            this.subscriptions.push(
                this.ngtHttpFormService.loadResourceById(this.resource, this.uriId)
                    .subscribe(
                        (resource: any) => {
                            this.setLoading(false);

                            this.onEditing.emit(resource);

                            setTimeout(() => this.ngForm.form.markAsPristine(), 1500);
                        },
                        (error) => {
                            this.setLoading(false);

                            this.onResourceLoadingError.emit(error);
                        }
                    )
            );

            return;
        }

        this.onEditing.emit(null);
    }

    private determineFormState() {
        return new Observable((observer) => {
            this.subscriptions.push(
                getIdFromUri(this.route, this.routeIdentifier).subscribe((id: string) => {
                    this.uriId = id;

                    if (this.uriId) {
                        this.setFormState(NgtFormStateEnum.EDITING);
                    } else {
                        this.setFormState(NgtFormStateEnum.CREATING);
                    }

                    observer.next();
                })
            );
        });
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
