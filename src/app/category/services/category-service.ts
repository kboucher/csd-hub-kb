declare var LIFERAY_VARS: any; // declare global LIFERAY_VARS

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Category } from '../models/category';

@Injectable()
export class CategoryService {
    private categoriesUrl = `${LIFERAY_VARS.portalUrl}/o/kb-rest-api/category/${LIFERAY_VARS.groupId}/tree/v1`;

    constructor(private http: Http) {}

    public getCategories(): Promise<Response> {
        return this.http.get(this.categoriesUrl)
            .map(function (res) {
                return res.json();
            }).toPromise();
    }
}
