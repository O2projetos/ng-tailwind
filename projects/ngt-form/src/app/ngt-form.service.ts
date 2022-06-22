import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export abstract class NgtHttpFormService {
    abstract loadResourceById(resource: any, resourceId: any): Observable<any>;
}

@Injectable()
export class NgtFormService {
    public constructor() {
    }
}
