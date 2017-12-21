declare var Liferay: any;
declare var updateUnreadJewels: any; // global unread jewel update function

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Article } from '../models/article';
import { Category } from '../../category/models/category';

const apiVersion = 'v1';

@Injectable()
export class ArticleService {
    private groupId: string;
    private portalUrl: string;
    private userId: string;

    constructor(private http: Http) {
        this.groupId = Liferay.ThemeDisplay.getScopeGroupId();
        this.portalUrl = Liferay.ThemeDisplay.getPortalURL();
        this.userId = Liferay.ThemeDisplay.getUserId();
    }

    public getPageSize(): number {
        let storedPageSize = window.localStorage.getItem('kbArticlesPageSize');

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
        let storedPageSize = this.getPageSize();

        if (pager && +pager.size !== storedPageSize) {
            this.setPageSize(pager.size);
        }

        if (pager) {
            articleListUrl =
                `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/category/${category}/page/${pager.page}/size/${pager.size}/${apiVersion}`;
        } else {
            articleListUrl = `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/category/${category}/${apiVersion}`;
        }

        return this.http.get(articleListUrl)
            .map(function (res) {
                return res.json();
            }).toPromise();
    }

    public getArticleById(articleId: number) : Promise<any> {
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/content/{articleId}/user/{userId}/v1

        let articleUrl =
            `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/content/${articleId}/user/${this.userId}/${apiVersion}`;

        return this.http.get(articleUrl)
            .map((res) => {
                let response = res.json();

                if (!response.length || response.length !== 2) {
                    throw(new TypeError('ArticleService Error: Expected web service to return an Unread Articles object and an Article object.'));
                }

                // calls global function on the theme
                updateUnreadJewels(response[0]);

                return response[1];
            }).toPromise();
    }

    public getUnreadArticles() : Promise<any> {
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadarticle/{userId}/page/{page}/size/{size}/v1
        let unreadArticlesUrl = `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/unreadarticle/${this.userId}/${apiVersion}`;

        return this.http.get(unreadArticlesUrl)
            .map(function (res) {
                return res.json();
            }).toPromise();
    }

    public getUnreadCount(): Promise<any> {
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/unreadcount/{userId}/v1
        var unreadCountUrl = `${this.portalUrl}/o/kb-rest-api/article/${this.groupId}/unreadcount/${this.userId}/${apiVersion}`;

        return this.http.get(unreadCountUrl)
            .map(function (res) {
                return res.json();
            }).toPromise();
    }
}
