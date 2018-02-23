declare var Liferay: any;
declare var KBUnread: any; // global unread link functions

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { UIRouter } from '@uirouter/angular';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../../../config/app.config';
import { AppService } from '../../app-service';
import { Category } from '../../category/models/category';
import { CategoryService } from '../../category/services/category-service';
import { Article } from '../models/article';

@Injectable()
export class ArticleService {
    public currentCategory: BehaviorSubject<Category>;
    private apiVersion: string;
    private groupId: string;
    private pageSize: number;
    private portalUrl: string;
    private sortCriterion: string;
    private sortOrder: string;

    constructor(
        private appConfig: AppConfig,
        private appService: AppService,
        private categoryService: CategoryService,
        private http: Http,
        private uiRouter: UIRouter,
    ) {
        this.apiVersion = appConfig.getEntryByKey('API_VERSION');
        this.groupId = Liferay.ThemeDisplay.getScopeGroupId();
        this.portalUrl = Liferay.ThemeDisplay.getPortalURL();

        this.currentCategory = new BehaviorSubject(null);

        this.appService.getPageSize().subscribe((value) => {
            this.pageSize = value;
        });

        this.appService.getSortCriterion().subscribe((value) => {
            this.sortCriterion = value;
        });

        this.appService.getSortOrder().subscribe((value) => {
            this.sortOrder = value;
        });
    }

    public getCurrentCategory(): Observable<Category> {
        return this.currentCategory.asObservable();
    }

    public setCurrentCategory(category: Category) {
        this.currentCategory.next(category);
    }

    public getArticlesByCategory(category: string, pager?: any): Promise<Response> {
        /* tslint:disable max-line-length */
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/category/{categoryId}/sort/{sortCriterion}/{sortOrder}/v1
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/category/{categoryId}/page/{page}/size/{size}/sort/{sortCriterion}/{sortOrder}/v1
        /* tslint:enable max-line-length */

        let articleListUrl;

        this.savePagingPreferences(pager);
        this.setCurrentCategory(this.categoryService.findById(this.categoryService.categories, category));

        /* tslint:disable max-line-length */
        if (pager.size > 0) {
            articleListUrl = `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/category/${category}/page/${pager.page}/size/${this.pageSize}/sort/${this.sortCriterion}/${this.sortOrder}/${this.apiVersion}`;
        } else {
            articleListUrl = `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/category/${category}/sort/${this.sortCriterion}/${this.sortOrder}/${this.apiVersion}`;
        }
        /* tslint:enable max-line-length */

        return this.http.get(articleListUrl)
            .map((res) => {
                return res.json();
            })
            .catch((err) => {
                return [{error: err}];
            })
            .toPromise();
    }

    public getArticleById(articleId: number): Promise<any> {
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/content/{articleId}/v1

        const articleUrl =
            `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/content/${articleId}/${this.apiVersion}`;

        return this.http.get(articleUrl)
            .map((res) => {
                const response = res.json();

                if (!response.length || response.length !== 2) {
                    throw(new TypeError('ArticleService Error: Expected web service to return' +
                    'an Unread Articles object and an Article object.'));
                }

                // calls global function on the theme
                if (KBUnread && KBUnread.updateJewels) {
                    KBUnread.updateJewels(response[0]);
                }

                return response[1];
            })
            /*
                We want to display article errors in the context of the
                article state and template. So catch and return as "article".
            */
            .catch((err) => {
                return [{error: err}];
            })
            .toPromise();
    }

    public getUnreadArticles(pager?: any): Promise<any> {
        /* tslint:disable max-line-length */
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadarticle/page/{page}/size/{size}/sort/{sortCriterion}/{sortOrder}/v1
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadarticle/sort/{sortCriterion}/{sortOrder}/v1
        /* tslint:enable max-line-length */

        let articleListUrl;

        this.savePagingPreferences(pager);
        this.setCurrentCategory(null);

        /* tslint:disable max-line-length */
        if (pager.size > 0) {
            articleListUrl = `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/unreadarticle/page/${pager.page}/size/${this.pageSize}/sort/${this.sortCriterion}/${this.sortOrder}/${this.apiVersion}`;
        } else {
            articleListUrl = `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/unreadarticle/sort/${pager.sortCriterion}/${pager.sortOrder}/${this.apiVersion}`;
        }
        /* tslint:enable max-line-length */

        return this.http.get(articleListUrl)
            .map((res) => {
                return res.json();
            })
            .toPromise();
    }

    public getUnreadCount(): Promise<any> {
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadcount/v1
        const unreadCountUrl = `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/unreadcount/${this.apiVersion}`;

        return this.http.get(unreadCountUrl)
            .map((res) => {
                const response = res.json();

                // calls global function on the theme
                if (KBUnread && KBUnread.updateJewels) {
                    KBUnread.updateJewels(response);
                }

                return response;
            })
            .toPromise();
    }

    private savePagingPreferences(pager: any): void {
        const pageSize = this.pageSize;
        const sortCriterion = this.sortCriterion;
        const sortOrder = this.sortOrder;

        if (pager.size && +pager.size !== pageSize) {
            this.appService.savePageSize(pager.size);
        }

        if (pager.sortCriterion && pager.sortCriterion !== sortCriterion) {
            this.appService.saveSortCriterion(pager.sortCriterion);
        }

        if (pager.sortOrder && pager.sortOrder !== sortOrder) {
            this.appService.saveSortOrder(pager.sortOrder);
        }
    }
}
