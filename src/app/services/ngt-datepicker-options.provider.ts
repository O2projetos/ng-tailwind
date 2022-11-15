import {Injectable} from "@angular/core";
import {Locale} from "date-fns";
import {ptBR} from "date-fns/locale";
import {
    NgtDatepickerCalendarThemeEnum,
    NgtDatepickerFirstCalendarDayEnum,
    NgtDatepickerPositionEnum,
    NgtDatepickerTypeEnum
} from "../../../projects/ng-tailwind/src/components/ngt-datepicker/ngt-datepicker.helper";

@Injectable()
export class NgtDatepickerOptionsProvider {
    public type?: NgtDatepickerTypeEnum;
    public minDate?: Date | null;
    public maxDate?: Date | null;
    public firstCalendarDay?: NgtDatepickerFirstCalendarDayEnum;
    public position?: NgtDatepickerPositionEnum;
    public calendarTemplate?: NgtDatepickerCalendarThemeEnum;
    // public calendarCustomTemplate?: NgtDatepickerCalendarTheme | null;
    public closeOnSelect?: boolean;
    public formatTitle?: string;
    public formatNgModel?: string;
    public formatInput?: string;
    public placeholder?: string;
    // public enableTime?: boolean;
    public hideCalendarIcon?: boolean;
    public clearable?: boolean;

    public get locale(): Locale {
        return ptBR;
    }
}
