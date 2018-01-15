declare var Liferay: any;
declare var KBUnread: any; // global unread functions

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { UIRouter } from '@uirouter/angular';

// Import RxJs required methods
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Category } from '../../category/models/category';
import { Article } from '../models/article';

const apiVersion = 'v1';

@Injectable()
export class ArticleService {
    groupId: string;
    portalUrl: string;

    constructor(private http: Http, private uiRouter: UIRouter) {
        this.groupId = Liferay.ThemeDisplay.getScopeGroupId();
        this.portalUrl = Liferay.ThemeDisplay.getPortalURL();
    }

    public getPageSize(): number {
        const storedPageSize = window.localStorage.getItem('kbArticlesPageSize');

        if (!storedPageSize) {
            window.localStorage.setItem('kbArticlesPageSize', '25');
            return 25;
        }

        return +storedPageSize;
    }

    public setPageSize(size: string) {
        window.localStorage.setItem('kbArticlesPageSize', size.toString());
    }

    public getArticlesByCategory(category: string, pager?: any): Promise<Response> {
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/category/{categoryId}/v1
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/category/{categoryId}/page/{page}/size/{size}/v1
        let articleListUrl;
        const storedPageSize = this.getPageSize();

        if (pager && +pager.size !== storedPageSize) {
            this.setPageSize(pager.size);
        }

        if (pager) {
            articleListUrl =
                `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/category/
${category}/page/${pager.page}/size/${pager.size}/${apiVersion}`;
        } else {
            articleListUrl = `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/category/
${category}/${apiVersion}`;
        }

        return this.http.get(articleListUrl)
            .map((res) => {
                return res.json();
            })
            .toPromise();
    }

    public getArticleById(articleId: number): Promise<any> {
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/content/{articleId}/v1

        const articleUrl =
            `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/content/${articleId}/${apiVersion}`;

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
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadarticle/page/{page}/size/{size}/v1
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadarticle/v1

        let articleListUrl;
        const storedPageSize = this.getPageSize();

        if (pager && +pager.size !== storedPageSize) {
            this.setPageSize(pager.size);
        }

        if (pager) {
            articleListUrl =
                `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/unreadarticle/
page/${pager.page}/size/${pager.size}/${apiVersion}`;
        } else {
            articleListUrl = `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/unreadarticle/
${apiVersion}`;
        }

        return this.http.get(articleListUrl)
            .map((res) => {
                return res.json();
            })
            .toPromise();
    }

    public getUnreadCount(): Promise<any> {
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadcount/v1
        const unreadCountUrl = `${this.portalUrl}/o/kb-rest-api/article/
${this.groupId}/unreadcount/${apiVersion}`;

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
}
