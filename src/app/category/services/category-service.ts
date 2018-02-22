declare var Liferay: any;

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { UIRouter } from '@uirouter/angular';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../../../config/app.config';
import { Category } from '../models/category';

@Injectable()
export class CategoryService {
    public categories: Category[];
    private apiVersion: string;
    private categoriesUrl: string;

    constructor(
        private appConfig: AppConfig,
        private http: Http,
        private uiRouter: UIRouter) {
            const portalUrl = Liferay.ThemeDisplay.getPortalURL();
            const groupId = Liferay.ThemeDisplay.getScopeGroupId();

            this.apiVersion = appConfig.getEntryByKey('API_VERSION');
            this.categoriesUrl = `${portalUrl}/o/kb-rest-api/category/${groupId}/tree/${this.apiVersion}`;
    }

    public getCategories(): Promise<any> {
        this.handleAnonymous();

        return this.http.get(this.categoriesUrl)
            .map((res) => {
                const categories = this.addStates(res.json());
                this.categories = categories;
                return categories;
            })
            .catch((err) => {
                return [{error: err}];
            })
            .toPromise();
    }

    public deselectCategories(categories): any {
        this.addStates(categories);
        return null;
    }

    /*
        Recursively searches categories to find one with a particular ID value.
     */
    public findById(collection: Category[], id: string): Category {
        if (collection.length) {
            for (const item of collection) {
                if (+item.id === +id) {
                    return item;
                }

                const found = this.findById(item.children, id);
                if (found) { return found; }
            }
        }
    }

    /*
        Recurses over categories and children to add
        jsTree state objects.

        @method addStates
        @param {Category[]} categories Array of Category objects that need state added.
     */
    private addStates(categories: Category[]) {
        function stateFactory() {
            return {
                disabled: false,
                opened: false,
                selected: false,
            };
        }

        for (const category of categories) {
            category.state = stateFactory();
            if (category.children.length) {
                this.addStates(category.children);
            }
        }

        return categories;
    }

    // TODO: Refactor this into app service?
    private handleAnonymous = () => {
        const isSignedIn = Liferay.ThemeDisplay.isSignedIn();

        if (!isSignedIn) {
            this.uiRouter.globals.transition.abort();
            this.uiRouter.stateService.go('anonymous-user');
        }
    }
}
