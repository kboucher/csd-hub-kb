import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Category } from '../models/category';

@Injectable()
export class CategoryService {
    /**
     * TODO: Make the relevant URL fragments dynamic (host, port, group ID, version?)
     */
    private categoriesUrl = 'http://localhost:8080/o/kb-rest-api/category/34543/tree/v1';

    constructor(private http: Http) {}

    public getCategories(): Promise<Response> {
        return this.http.get(this.categoriesUrl)
            .map(function (res) {
                return res.json();
            }).toPromise();
    }
}
