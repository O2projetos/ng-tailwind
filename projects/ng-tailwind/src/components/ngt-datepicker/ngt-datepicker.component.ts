import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Host,
    HostListener,
    Injector,
    Input,
    OnDestroy,
    Optional,
    Self,
    SimpleChanges,
    SkipSelf,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {ControlContainer, NgForm, Validators} from "@angular/forms";
import {
    Day,
    defaultDatePickerOptions,
    defaultTemplateCalendarClasses,
    NgtDatepickerCalendarTheme,
    NgtDatepickerCalendarThemeEnum,
    NgtDatepickerFirstCalendarDayEnum,
    NgtDatepickerOptions,
    NgtDatepickerPositionEnum,
    NgtDatepickerTypeEnum,
    nightTemplateCalendarClasses
} from "./ngt-datepicker.helper";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDate,
    getDay,
    getMonth,
    getYear,
    isAfter,
    isBefore,
    isSameDay,
    isToday,
    isWithinInterval,
    parse,
    setDay,
    startOfMonth,
    subDays,
    subMonths
} from "date-fns";
import {Subscription} from "rxjs";
import {uuid} from "../../helpers/uuid";
import {NgtBaseNgModel, NgtMakeProvider} from "../../base/ngt-base-ng-model";
import {NgtStylizableService} from "../../services/ngt-stylizable/ngt-stylizable.service";
import {NgtStylizableDirective} from "../../directives/ngt-stylizable/ngt-stylizable.directive";
import {NgtDatepickerOptionsService} from "./ngt-datepicker-options.service";
import {NgtFormComponent} from "../ngt-form/ngt-form.component";

@Component({
    selector: 'ngt-datepicker',
    templateUrl: 'ngt-datepicker.component.html',
    styleUrls: ['ngt-datepicker.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        NgtMakeProvider(NgtDatepickerComponent),
    ],
    viewProviders: [
        {provide: ControlContainer, useExisting: NgForm}
    ]
})
export class NgtDatepickerComponent extends NgtBaseNgModel implements AfterViewInit, OnDestroy {
    @ViewChild('datepicker') public datepicker: ElementRef;
    @ViewChild('input') public input: ElementRef;

    // Visual
    @Input() public label: string = "";
    @Input() public placeholder: string = "dd/mm/yyyy";
    @Input() public helpTitle: string;
    @Input() public helpText: string;
    @Input() public hideCalendarIcon: boolean = false;
    @Input() public position: NgtDatepickerPositionEnum;
    @Input() public formatTitle?: string;
    @Input() public formatInput?: string;
    @Input() public firstCalendarDay?: NgtDatepickerFirstCalendarDayEnum;
    @Input() public calendarTemplate?: NgtDatepickerCalendarThemeEnum;
    @Input() public closeOnSelect?: boolean;
    @Input() public formatNgModel?: string;
    @Input() public shining = false;
    // @Input() public enableTime?: boolean;
    // @Input() public calendarCustomTemplate?: NgtDatepickerCalendarTheme | null;

    // Behavior
    @Input() public options: NgtDatepickerOptions;
    @Input() public isOpened: boolean;
    @Input() public name: string = uuid();
    @Input() public locale: Locale;
    @Input() public minDate: Date;
    @Input() public maxDate: Date;
    @Input() public type: NgtDatepickerTypeEnum;
    @Input() public defaultDate: Date | string;
    @Input() public isRequired: boolean;
    @Input() public isDisabled: boolean;
    @Input() public clearable: boolean;

    public dates: Array<Date> = [];
    public renderDate: Date;
    public days: Array<Day>;
    public weekDays: Array<string>;

    public componentReady = false;
    public innerValue: Array<Date> = [];
    public ngtDatepickerInputStyle: NgtStylizableService;
    public ngtDatepickerStyle: NgtStylizableService;
    public ngtDatepickerPositionEnum = NgtDatepickerPositionEnum;
    private subscriptions: Array<Subscription> = [];

    public constructor(
        public ngtDatepickerOptionsService: NgtDatepickerOptionsService,
        public formContainer: ControlContainer,
        @Optional() @SkipSelf()
        private ngtFormComponent: NgtFormComponent,
        private injector: Injector,
        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @Host()
        private changeDetectorRef: ChangeDetectorRef
    ) {
        super();

        this.loadNgtStylizable();
        this.addFormSubscriptions();
    }

    @HostListener('document:click', ['$event'])
    public onBlur(e: MouseEvent): void {
        if (!this.isOpened) {
            return;
        }

        if (
            !this.input.nativeElement
            || this.input.nativeElement === e.target
            || this.input.nativeElement.contains(e.target)
            || (e.target as HTMLElement).classList.contains('day-unit')
        ) {
            return;
        }

        if (
            this.datepicker.nativeElement
            && this.datepicker.nativeElement !== e.target
            && !this.datepicker.nativeElement.contains(e.target)
        ) {
            this.isOpened = false;
        }
    }

    public get date(): Date {
        return this.dates[0] ?? new Date();
    }

    public set date(date: Date) {
        this.dates = [date];
    }

    public get formattedValue(): Array<string> | string {
        if (!this.innerValue?.length) {
            return this.type == NgtDatepickerTypeEnum.RANGE ? [] : null;
        }

        if (this.innerValue?.length == 1) {
            return this.type == NgtDatepickerTypeEnum.RANGE
                ? [format(this.innerValue[0], this.datepickerOptions.formatNgModel)]
                : format(this.innerValue[0], this.datepickerOptions.formatNgModel);
        }

        return this.innerValue.map(date => format(date, this.datepickerOptions.formatNgModel));
    }

    public get formattedDates(): string {
        if (!this.innerValue?.length) {
            return;
        }

        if (this.innerValue?.length == 1) {
            return format(this.innerValue[0], this.datepickerOptions.formatInput);
        }

        return this.innerValue.map(date => format(date, this.datepickerOptions.formatInput)).join(', ');
    }

    public get datepickerOptions(): NgtDatepickerOptions {
        return <NgtDatepickerOptions>{
            ...{type: this.type ?? this.ngtDatepickerOptionsService.type ?? defaultDatePickerOptions.type},
            ...{minDate: this.minDate ?? this.ngtDatepickerOptionsService.minDate ?? defaultDatePickerOptions.minDate},
            ...{maxDate: this.maxDate ?? this.ngtDatepickerOptionsService.maxDate ?? defaultDatePickerOptions.maxDate},
            ...{firstCalendarDay: this.firstCalendarDay ?? this.ngtDatepickerOptionsService.firstCalendarDay ?? defaultDatePickerOptions.firstCalendarDay},
            ...{position: this.position ?? this.ngtDatepickerOptionsService.position ?? defaultDatePickerOptions.position},
            ...{calendarTemplate: this.template ?? this.ngtDatepickerOptionsService.calendarTemplate ?? defaultDatePickerOptions.calendarTemplate},
            ...{closeOnSelect: this.closeOnSelect ?? this.ngtDatepickerOptionsService.closeOnSelect ?? defaultDatePickerOptions.closeOnSelect},
            ...{formatTitle: this.formatTitle ?? this.ngtDatepickerOptionsService.formatTitle ?? defaultDatePickerOptions.formatTitle},
            ...{formatNgModel: this.formatNgModel ?? this.ngtDatepickerOptionsService.formatNgModel ?? defaultDatePickerOptions.formatNgModel},
            ...{formatInput: this.formatInput ?? this.ngtDatepickerOptionsService.formatInput ?? defaultDatePickerOptions.formatInput},
            ...{placeholder: this.placeholder ?? this.ngtDatepickerOptionsService.placeholder ?? defaultDatePickerOptions.placeholder},
            ...{hideCalendarIcon: this.hideCalendarIcon ?? this.ngtDatepickerOptionsService.hideCalendarIcon ?? defaultDatePickerOptions.hideCalendarIcon},
            ...{clearable: this.clearable ?? this.ngtDatepickerOptionsService.clearable ?? defaultDatePickerOptions.clearable},
            ...{locale: this.locale ?? this.ngtDatepickerOptionsService.locale ?? defaultDatePickerOptions.locale},
        };
    }

    public get template(): NgtDatepickerCalendarTheme {
        return {
            [NgtDatepickerCalendarThemeEnum.DEFAULT]: defaultTemplateCalendarClasses,
            [NgtDatepickerCalendarThemeEnum.NIGHT]: nightTemplateCalendarClasses,
        }[this.calendarTemplate ?? this.ngtDatepickerOptionsService?.calendarTemplate ?? NgtDatepickerCalendarThemeEnum.DEFAULT];
    }

    public ngAfterViewInit(): void {
        this.init();
        this.changeDetectorRef.detectChanges();
    }

    public ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    public clear(): void {
        this.innerValue = [];

        if (this.type == NgtDatepickerTypeEnum.RANGE) {
            this.value = [];
        } else {
            this.value = null;
        }

        this.days?.filter(day => day.isSelected)?.forEach(day => day.isSelected = false);
    }

    public dayClasses(day): Object {
        if (!this.template) {
            return;
        }

        if (!day.inThisMonth || !day.isSelectable) {
            return this.template.dayNotSelectable;
        }

        if (day.isSelected) {
            return this.template.selectedDay;
        }

        if (day.isToday) {
            return this.template.today;
        }
    }

    public open(): void {
        this.isOpened = true;
    }

    public close(): void {
        this.isOpened = false;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.isRequired) {
            this.updateValidations();
        }
    }

    public change(value?: Date | Array<Date> | Array<string> | string): void {
        if (this.componentReady) {
            this.onValueChangeEvent.emit(this.value);
        }

        if (!(value instanceof Date) && !(typeof value == "string") && !Array.isArray(value) && value !== null && value !== undefined) {
            return this.clear();
        }

        if (value && typeof value == "string") {
            this.date = parse(value, this.datepickerOptions.formatNgModel, new Date());
        }

        if (value && value instanceof Date) {
            this.date = value;
        }

        if (value && Array.isArray(value) && typeof value[0] == "string") {
            this.dates = value.map(val => parse(val, this.datepickerOptions.formatNgModel, new Date()));
        }

        if (value && Array.isArray(value) && value[0] instanceof Date) {
            this.dates = <Array<Date>>value;
        }

        this.innerValue = this.dates;
        this.value = this.formattedValue;
        this.initDays();
    }

    public nextMonth(): void {
        this.renderDate = addMonths(this.renderDate, 1);
        this.initDays();
    }

    public prevMonth(): void {
        this.renderDate = subMonths(this.renderDate, 1);
        this.initDays();
    }

    public setDate(day: Day): void {
        if (!day.isSelectable) {
            return;
        }

        this.dates = !this.innerValue || this.dates?.length == 2 || this.datepickerOptions.type == NgtDatepickerTypeEnum.NORMAL
            ? [day.date]
            : this.getSortedDateArray([...this.dates, ...[day.date]]);

        this.innerValue = this.dates;
        this.value = this.formattedValue;

        this.initDays();

        if (this.canCloseAfterSelectDate()) {
            return this.close();
        }
    }

    public hasErrors(): boolean {
        return this.formControl?.errors && (this.formControl?.dirty || (this.formContainer && this.formContainer['submitted']));
    }

    public getMonthName() {
        return format(this.renderDate, 'MMMM/yyyy', {locale: this.datepickerOptions.locale});
    }

    private getSortedDateArray(dates: Array<Date>): Array<Date> {
        if (dates?.length == 1) {
            return dates;
        }

        return dates[0] > dates[1] ? [dates[1], dates[0]] : [dates[0], dates[1]];
    }

    private canCloseAfterSelectDate(): boolean {
        return (
            this.datepickerOptions.type == NgtDatepickerTypeEnum.NORMAL
            && this.datepickerOptions.closeOnSelect
        ) || (
            this.datepickerOptions.type == NgtDatepickerTypeEnum.RANGE
            && this.datepickerOptions.closeOnSelect
            && this.dates.length == 2
        );
    }

    private init(): void {
        if (this.formContainer && this.formContainer.control && (this.formControl = this.formContainer.control.get(this.name))) {
            if (this.defaultDate && !this.value) {
                this.date = this.defaultDate instanceof Date ? this.defaultDate : new Date(this.defaultDate);
                this.innerValue = [this.date];
            } else {
                this.innerValue = [];
            }

            this.value = this.formattedValue;
            // this.updateValidations();

            // if (this.value) {
            //     this.formControl.markAsDirty();
            // } else {
            //     this.formControl.markAsPristine();
            // }
        }

        this.renderDate = this.date ?? new Date();
        this.componentReady = true;

        this.initDayNames();
        this.initDays();
    }

    private initDays(): void {
        const [start, end] = [startOfMonth(this.renderDate ?? new Date()), endOfMonth(this.renderDate ?? new Date())];

        this.days = eachDayOfInterval({start, end}).map((d: Date) => this.generateDay(d));

        const prevDays = getDay(start) < 0 ? 7 : getDay(start);

        for (let i = 1; i <= prevDays; i++) {
            const d = subDays(start, i);

            this.days.unshift(this.generateDay(d, false));
        }
    }

    private initDayNames(): void {
        this.weekDays = [];

        for (let i = 0; i <= 6; i++) {
            const date = setDay(new Date(), i);

            this.weekDays.push(format(date, 'EEEEEE', {locale: this.datepickerOptions.locale}));
        }
    }

    private generateDay(date: Date, inThisMonth: boolean = true): Day {
        return {
            date,
            day: getDate(date),
            month: getMonth(date),
            year: getYear(date),
            inThisMonth,
            isToday: isToday(date),
            isSelected: this.isDaySelected(date),
            isSelectable: this.isDateSelectable(date)
        };
    }

    private isDaySelected(date: Date): boolean {
        if (!this.innerValue) {
            return;
        }

        if (this.innerValue?.length != 2) {
            return isSameDay(date, this.innerValue[0]);
        }

        return isWithinInterval(date, {start: this.innerValue[0], end: this.innerValue[1]});
    }

    private isDateSelectable(date: Date): boolean {
        if (this.datepickerOptions.minDate && isBefore(date, this.datepickerOptions.minDate)) {
            return false;
        }

        return !(this.datepickerOptions.maxDate && isAfter(date, this.datepickerOptions.maxDate));
    }

    private updateValidations() {
        if (!this.formControl) {
            return;
        }

        let syncValidators = [];

        if (this.isRequired) {
            syncValidators.push(Validators.required);
        }

        setTimeout(() => {
            this.formControl.setValidators(syncValidators);
            this.formControl.updateValueAndValidity();
        });
    }

    private addFormSubscriptions(): void {
        if (this.ngtFormComponent) {
            this.shining = this.ngtFormComponent.isShining();

            this.subscriptions.push(
                this.ngtFormComponent.onShiningChange.subscribe((shining: boolean) => {
                    this.shining = shining;
                })
            );
        }
    }

    private loadNgtStylizable(): void {
        if (this.ngtStylizableDirective) {
            this.ngtDatepickerInputStyle = this.ngtStylizableDirective.getNgtStylizableService();
            this.ngtDatepickerStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtDatepickerInputStyle = new NgtStylizableService();
            this.ngtDatepickerStyle = new NgtStylizableService();
        }

        this.ngtDatepickerStyle.load(this.injector, 'NgtDatepicker', {
            text: 'text-base',
            fontCase: '',
            border: 'border',
            color: {
                text: 'text-gray-800',
                bg: 'bg-gray-200',
                border: 'border-gray-300'
            }
        });

        this.ngtDatepickerInputStyle.load(this.injector, 'NgtDatepickerInput', {
            h: 'h-10',
            border: 'border',
            text: 'text-base',
            rounded: 'rounded',
            fontCase: '',
            color: {
                text: 'text-gray-800',
                bg: 'bg-gray-200',
                border: ''
            }
        });
    }
}
