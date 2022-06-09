import {
    AfterViewInit, ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {ControlContainer, NgForm} from "@angular/forms";
import {NgtBaseNgModel, NgtMakeProvider} from "../base/ngt-base-ng-model";
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
    isSameMonth,
    isSameYear,
    isToday, isWithinInterval,
    setDay,
    startOfMonth,
    subDays,
    subMonths
} from "date-fns";
import {uuid} from "../helper/uuid";

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
export class NgtDatepickerComponent extends NgtBaseNgModel implements AfterViewInit {
    @ViewChild('datepicker') public datepicker: ElementRef;
    @ViewChild('input') public input: ElementRef;

    @Input() public options: NgtDatepickerOptions = defaultDatePickerOptions;
    @Input() public isOpened: boolean;
    @Input() public inputClasses: string = 'border h-10';
    @Input() public name: string = uuid();
    @Input() public calendarTheme: NgtDatepickerCalendarThemeEnum;
    @Input() public locale: Locale;
    @Input() public type: NgtDatepickerTypeEnum;

    // TODO Implements custom theme
    // @Input() public calendarCustomTheme: NgtDatepickerCalendarTheme;

    @HostListener('document:click', ['$event']) onBlur(e: MouseEvent): void {
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

    public dates: Array<Date> = [];
    public days: Array<Day>;
    public weekDays: Array<string>;

    public constructor(private changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    public get date(): Date | null {
        return this.dates[0];
    }

    public set date(date: Date) {
        this.dates = [date];
    }

    public get formattedValue(): string {
        if (!this.value?.length) {
            return '';
        }

        if (this.value?.length == 1) {
            return format(this.date, this.datepickerOptions.formatInput);
        }

        return this.value.map(date => format(date, this.datepickerOptions.formatInput)).join(', ');
    }

    public get datepickerOptions(): NgtDatepickerOptions {
        return <NgtDatepickerOptions>{
            ...defaultDatePickerOptions,
            ...this.options,
            ...{locale: this.locale ?? this.options.locale},
            ...{type: this.type ?? this.options.type}
        };
    }

    public get template(): NgtDatepickerCalendarTheme {
        if (!this.options.calendarTemplate) {
            this.options.calendarTemplate = NgtDatepickerCalendarThemeEnum.DEFAULT;
        }

        // if (this.calendarTheme == NgtDatepickerCalendarThemeEnum.CUSTOM) {
        //     return {...this.calendarCustomTheme, ...defaultTemplateCalendarClasses};
        // }

        return {
            [NgtDatepickerCalendarThemeEnum.DEFAULT]: defaultTemplateCalendarClasses,
            [NgtDatepickerCalendarThemeEnum.NIGHT]: nightTemplateCalendarClasses,
            // [NgtDatepickerCalendarThemeEnum.CUSTOM]: this.datepickerOptions.calendarCustomTemplate
        }[this.calendarTheme ?? this.options.calendarTemplate];
    }

    public ngAfterViewInit(): void {
        this.init();
        this.changeDetectorRef.detectChanges();
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
            return this.template.today
        }
    }

    public open(): void {
        this.isOpened = true;
    }

    public close(): void {
        this.isOpened = false;
    }

    public clickOutsideDatepicker(): void {
        console.log(this.isOpened);

        if (!this.isOpened) {
            return;
        }

        this.isOpened = false;
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

        this.dates = !this.value || this.dates?.length == 2 || this.datepickerOptions.type == NgtDatepickerTypeEnum.NORMAL
            ? [day.date]
            : this.getSortedDateArray([...this.dates, ...[day.date]]);

        this.value = this.dates;

        this.initDays();

        if (this.canCloseAfterSelectDate()) {
            return this.close();
        }
    }

    private getSortedDateArray(dates: Array<Date>): Array<Date> {
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
        this.date = new Date();

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
        if (!this.value) {
            return;
        }

        if (this.value?.length != 2) {
            return isSameDay(date, this.date);
        }

        return isWithinInterval(date, {start: this.value[0], end: this.value[1]});
    }

    private isDateSelectable(date: Date): boolean {
        if (this.options.minDate && isBefore(date, this.options.minDate)) {
            return false;
        }

        return !(this.options.maxDate && isAfter(date, this.options.maxDate));
    }
}
