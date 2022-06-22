import {Injectable} from "@angular/core";

export interface NgtHttpValidationService {
    emailValidation(email: string): Promise<NgtHttpValidationResponse>;
    phoneValidation(phone: string): Promise<NgtHttpValidationResponse>;
}

export abstract class NgtHttpValidationService {
    public abstract unique(validationResource: any, value: any): Promise<NgtHttpValidationResponse>;

    public abstract exists(validationResource: any, value: any): Promise<NgtHttpValidationResponse>;
}

export interface NgtHttpValidationResponse {
    valid: boolean;
}

export abstract class NgtValidationTranslateService {
    public abstract ngtValidationMaxCharactersExceded: string;
    public abstract ngtValidationRequiredField: string;
    public abstract ngtValidationInvalidEmail: string;
    public abstract ngtValidationAlreadyExists: string;
    public abstract ngtValidationInvalidCnpj: string;
    public abstract ngtValidationInvalidCpf: string;
    public abstract ngtValidationPasswordRequiredMinCharacters: string;
    public abstract ngtValidationFieldsNotMatch: string;
    public abstract ngtValidationInvalidDate: string;
    public abstract ngtValidationInvalidPrevision: string;
    public abstract ngtValidationExternalServerUnavailable: string;
    public abstract ngtValidationValueMustBeGreaterThan(minValue?: number | string): string;
    public abstract ngtValidationMinLengthField(minLength?: number | string): string;
}

@Injectable()
export class NgtValidationTranslateProvider extends NgtValidationTranslateService {
    public ngtValidationMaxCharactersExceded: string = 'Maximum number of characters exceeded.';
    public ngtValidationRequiredField: string = 'Required Field.';
    public ngtValidationInvalidEmail: string = 'Invalid email.';
    public ngtValidationAlreadyExists: string = 'Already exists.';
    public ngtValidationInvalidCnpj: string = 'Invalid document number.';
    public ngtValidationInvalidCpf: string = 'Invalid document number.';
    public ngtValidationPasswordRequiredMinCharacters: string = 'Field must be at least 8 characters.';
    public ngtValidationFieldsNotMatch: string = 'Fields do not match.';
    public ngtValidationInvalidDate: string = 'Invalid date.';
    public ngtValidationInvalidPrevision: string = 'Invalid forecast.';
    public ngtValidationExternalServerUnavailable: string = 'External server unavailable.';
    public ngtValidationValueMustBeGreaterThan(minValue?: string | number): string {
        return 'The value entered must be greater than or equal to ' + minValue;
    }

    public ngtValidationMinLengthField(minLength?: string | number): string {
        return 'Field must be at least ' + minLength + '  characters.';
    }
}
