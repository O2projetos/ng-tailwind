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
    NgtDatepickerOptions,
    NgtDatepickerTypeEnum,
    nightTemplateCalendarClasses
} from "./ngt-datepicker.helper";
import locale from 'date-fns/locale/pt-BR';
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
import {uuid} from "../helper/uuid";
import {NgtStylizableDirective, NgtStylizableService} from "@o2projetos/ngt-stylizable";
import {Subscription} from "rxjs";
import {NgtBaseNgModel, NgtMakeProvider} from "@o2projetos/ngt-form";

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
    @Input() public calendarTheme: NgtDatepickerCalendarThemeEnum;

    // Behavior
    @Input() public options: NgtDatepickerOptions = defaultDatePickerOptions;
    @Input() public isOpened: boolean;
    @Input() public name: string = uuid();
    @Input() public locale: Locale;
    @Input() public type: NgtDatepickerTypeEnum;
    @Input() public defaultDate: Date | string;
    @Input() public isRequired: boolean;
    @Input() public isDisabled: boolean;
    @Input() public clearable: boolean;

    public dates: Array<Date> = [];
    public days: Array<Day>;
    public weekDays: Array<string>;

    public componentReady = false;
    public innerValue: Array<Date> = [];
    public ngtStyle: NgtStylizableService;
    private subscriptions: Array<Subscription> = [];

    public constructor(
        private injector: Injector,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @Host()
        public formContainer: ControlContainer,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        super();

        this.loadNgtStylizable();
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

    public get date(): Date | null {
        return this.dates[0];
    }

    public set date(date: Date) {
        this.dates = [date];
    }

    public get formattedValue(): Array<string> {
        if (!this.innerValue?.length) {
            return;
        }

        if (this.innerValue?.length == 1) {
            return [format(this.date, this.datepickerOptions.formatInput)];
        }

        return this.innerValue.map(date => format(date, this.datepickerOptions.formatInput));
    }

    public get formattedDates(): string {
        if (!this.innerValue?.length) {
            return '';
        }

        if (this.innerValue?.length == 1) {
            return format(this.date, this.datepickerOptions.formatInput);
        }

        return this.innerValue.map(date => format(date, this.datepickerOptions.formatInput)).join(', ');
    }

    public get datepickerOptions(): NgtDatepickerOptions {
        return <NgtDatepickerOptions>{
            ...defaultDatePickerOptions,
            ...this.options,
            ...{locale: this.locale ?? this.options.locale},
            ...{type: this.type ?? this.options.type},
            ...{clearable: this.clearable ?? this.options.clearable},
            ...{placeholder: this.placeholder ?? this.options.placeholder},
            ...{hideCalendarIcon: this.hideCalendarIcon ?? this.options.hideCalendarIcon}
        };
    }

    public get template(): NgtDatepickerCalendarTheme {
        if (!this.options.calendarTemplate) {
            this.options.calendarTemplate = NgtDatepickerCalendarThemeEnum.DEFAULT;
        }

        return {
            [NgtDatepickerCalendarThemeEnum.DEFAULT]: defaultTemplateCalendarClasses,
            [NgtDatepickerCalendarThemeEnum.NIGHT]: nightTemplateCalendarClasses,
        }[this.calendarTheme ?? this.options.calendarTemplate];
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
        this.date = new Date();
        this.innerValue = [];
        this.value = null;

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

    public ngOnChanges(): void {
        this.updateValidations();
    }

    public change(value: Date | Array<Date> | Array<string> | string): void {
        if (this.componentReady) {
            this.onValueChangeEvent.emit(this.value);
        }

        if (!(value instanceof Date) && !Array.isArray(value)) {
            return this.clear();
        }

        if (typeof value == "string") {
            this.date = parse(value, this.datepickerOptions.formatInput, new Date());
        }

        if (value instanceof Date) {
            this.date = value;
        }

        if (Array.isArray(value) && typeof value[0] == "string") {
            this.dates = value.map(val => parse(val, this.datepickerOptions.formatInput, new Date()));
        }

        if (Array.isArray(value) && value[0] instanceof Date) {
            this.dates = <Array<Date>>value;
        }

        this.innerValue = this.dates;
        this.value = this.formattedValue;
    }

    public nextMonth(): void {
        this.date = addMonths(this.date, 1);
        this.initDays();
    }

    public prevMonth(): void {
        this.date = subMonths(this.date, 1);
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
        )
            || (
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
                this.value = this.formattedValue;
            } else {
                this.date = new Date();
                this.innerValue = [];
                this.value = null;
            }

            this.updateValidations();

            if (this.value) {
                this.formControl.markAsDirty();
            } else {
                this.formControl.markAsPristine();
            }
        }

        this.componentReady = true;

        this.initDayNames();
        this.initDays();
    }

    private initDays(): void {
        const date = this.date || new Date();
        const [start, end] = [startOfMonth(date), endOfMonth(date)];

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

            this.weekDays.push(format(date, 'EEEEEE', {locale: locale}));
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
            return isSameDay(date, this.date);
        }

        return isWithinInterval(date, {start: this.innerValue[0], end: this.innerValue[1]});
    }

    private isDateSelectable(date: Date): boolean {
        if (this.options.minDate && isBefore(date, this.options.minDate)) {
            return false;
        }

        return !(this.options.maxDate && isAfter(date, this.options.maxDate));
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

    private loadNgtStylizable(): void {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtDatepicker', {
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
