declare var Liferay: any;

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Category } from '../models/category';

const apiVersion = 'v1';

@Injectable()
export class CategoryService {
    private categoriesUrl: string;

    constructor(private http: Http) {
        let portalUrl = Liferay.ThemeDisplay.getPortalURL();
        let groupId = Liferay.ThemeDisplay.getScopeGroupId();

        this.categoriesUrl = `${portalUrl}/o/kb-rest-api/category/${groupId}/tree/${apiVersion}`;
    }

    public getCategories(): Promise<Response> {
        return this.http.get(this.categoriesUrl)
            .map(function (res) {
                return res.json();
            }).toPromise();
    }

    /**
        Recursively searches categories to find one with a particular ID value.
    */
    public findById(collection: Category[], id: string): Category {
        if (collection.length) {
            for (var i = 0; i < collection.length; i++) {
                if (collection[i].id == id) {
                    return collection[i];
                }

                let found = this.findById(collection[i].children, id);
                if (found) return found;
            }
        }
    }
}
