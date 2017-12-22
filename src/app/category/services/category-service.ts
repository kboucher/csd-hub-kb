declare var Liferay: any;

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UIRouter } from '@uirouter/angular';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Category } from '../models/category';

const apiVersion = 'v1';

@Injectable()
export class CategoryService {
    private categoriesUrl: string;

    constructor(private http: Http, private uiRouter: UIRouter) {
        let portalUrl = Liferay.ThemeDisplay.getPortalURL();
        let groupId = Liferay.ThemeDisplay.getScopeGroupId();

        this.categoriesUrl = `${portalUrl}/o/kb-rest-api/category/${groupId}/tree/${apiVersion}`;
    }

    public getCategories(): Promise<any> {
        this.handleAnonymous();

        return this.http.get(this.categoriesUrl)
            .map((res) => {
                return this.addStates(res.json());
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

    /**
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
                selected: false
            };
        }

        for (let i = 0; i < categories.length; i++) {
            categories[i].state = stateFactory();
            if (categories[i].children.length) {
                this.addStates(categories[i].children);
            }
        }

        return categories;
    }

    /**
        Recurses over categories and children to deselect
        and close all jsTree state objects.

        @method deselectAll
        @param {Category[]} categories Array of Category objects that need to be deselected.
     */
    public deselectAll(categories: Category[]): Category[] {
        for (let i = 0; i < categories.length; i++) {
            categories[i].state.selected = false;

            if (categories[i].children.length) {
                this.deselectAll(categories[i].children);
            }
        }

        return categories;
    }

    // TODO: Refactor this into a service
    private handleAnonymous() {
        var isSignedIn = Liferay.ThemeDisplay.isSignedIn();

        if (!isSignedIn) {
            this.uiRouter.stateService.transitionTo('anonymous-user');
        }
    }
}
