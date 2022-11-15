import {Locale} from 'date-fns';
import locale from 'date-fns/locale/en-US';

export enum NgtDatepickerFirstCalendarDayEnum {
    SUNDAY = 'SUNDAY',
    MONDAY = 'MONDAY'
}

export enum NgtDatepickerTypeEnum {
    NORMAL = 'NORMAL',
    RANGE = 'RANGE'
}

export enum NgtDatepickerPositionEnum {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    AUTO = 'AUTO'
}

// TODO Implements custom theme
export enum NgtDatepickerCalendarThemeEnum {
    DEFAULT = 'DEFAULT',
    NIGHT = 'NIGHT',
    // CUSTOM = 'CUSTOM'
}

export interface Day {
    date: Date;
    day: number;
    month: number;
    year: number;
    inThisMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isSelectable: boolean;
}

export interface NgtDatepickerOptions {
    type?: NgtDatepickerTypeEnum;
    minDate?: Date | null;
    maxDate?: Date | null;
    firstCalendarDay?: NgtDatepickerFirstCalendarDayEnum;
    locale?: Locale;
    position?: NgtDatepickerPositionEnum;
    calendarTemplate?: NgtDatepickerCalendarThemeEnum;
    calendarCustomTemplate?: NgtDatepickerCalendarTheme | null;
    closeOnSelect?: boolean;
    formatTitle?: string;
    formatNgModel?: string;
    formatInput?: string;
    placeholder?: string;
    // enableTime?: boolean;
    hideCalendarIcon?: boolean;
    clearable?: boolean;
}

export interface NgtDatepickerCalendarTheme {
    datepickerBackground?: string;
    textColor?: string;
    dayNotSelectable?: string;
    today?: string;
    selectedDay?: string;
    onDayHover?: string;
}

export const defaultDatePickerOptions: NgtDatepickerOptions = {
    type: NgtDatepickerTypeEnum.NORMAL,
    minDate: null,
    maxDate: null,
    firstCalendarDay: NgtDatepickerFirstCalendarDayEnum.SUNDAY,
    locale: locale,
    position: NgtDatepickerPositionEnum.AUTO,
    calendarTemplate: NgtDatepickerCalendarThemeEnum.DEFAULT,
    calendarCustomTemplate: null,
    closeOnSelect: true,
    formatNgModel: 'yyyy-MM-dd',
    formatTitle: 'EEEEE',
    formatInput: 'dd/MM/yyyy',
    placeholder: 'dd/MM/yyyy hh:ii',
    hideCalendarIcon: false
};

export const defaultTemplateCalendarClasses: NgtDatepickerCalendarTheme = {
    datepickerBackground: 'bg-white',
    textColor: 'text-gray-800',
    dayNotSelectable: 'text-gray-300',
    today: 'font-bold border border-gray-800',
    selectedDay: 'bg-gray-800 bold text-white',
    onDayHover: 'hover:bg-gray-800 hover:text-white'
};

export const nightTemplateCalendarClasses: NgtDatepickerCalendarTheme = {
    datepickerBackground: 'bg-gray-800',
    textColor: 'text-white',
    dayNotSelectable: 'text-gray-400',
    today: 'font-bold border border-white',
    selectedDay: 'bg-white bold text-gray-800',
    onDayHover: 'hover:bg-white hover:text-gray-800'
};
