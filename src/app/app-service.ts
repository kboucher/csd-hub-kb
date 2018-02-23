declare var Liferay: any;

import { Injectable } from '@angular/core';
import { AppConfig } from '../config/app.config';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

const pageSizeKey = 'kbArticlesPageSize';
const sortCriterionKey = 'kbArticlesSortCriterion';
const sortOrderKey = 'kbArticlesSortOrder';

@Injectable()
export class AppService {
    public pageSize: BehaviorSubject<number>;
    public sortCriterion: BehaviorSubject<string>;
    public sortOrder: BehaviorSubject<string>;

    private defaultPageSize: number;
    private defaultSortCriterion: string;
    private defaultSortOrder: string;

    constructor(private appConfig: AppConfig) {
        this.defaultPageSize = appConfig.getEntryByKey('DEFAULT_PAGE_SIZE');
        this.defaultSortCriterion = appConfig.getEntryByKey('DEFAULT_SORT_CRITERION');
        this.defaultSortOrder = appConfig.getEntryByKey('DEFAULT_SORT_ORDER');

        this.pageSize = new BehaviorSubject(+this.getFromLocalStorage(pageSizeKey, this.defaultPageSize.toString()));
        this.sortCriterion = new BehaviorSubject(this.getFromLocalStorage(sortCriterionKey, this.defaultSortCriterion));
        this.sortOrder = new BehaviorSubject(this.getFromLocalStorage(sortOrderKey, this.defaultSortOrder));
    }

    public getPageSize(): Observable<number> {
        const pageSize = this.getFromLocalStorage(pageSizeKey, this.defaultPageSize.toString());

        this.pageSize.next(+pageSize);

        return this.pageSize.asObservable();
    }

    public getSortCriterion(): Observable<string> {
        const sortCriterion = this.getFromLocalStorage(sortCriterionKey, this.defaultSortCriterion);

        this.sortCriterion.next(sortCriterion);

        return this.sortCriterion.asObservable();
    }

    public getSortOrder(): Observable<string> {
        const sortOrder = this.getFromLocalStorage(sortOrderKey, this.defaultSortOrder);

        this.sortOrder.next(sortOrder);

        return this.sortOrder.asObservable();
    }

    public savePageSize(size: string) {
        this.pageSize.next(+size);
        this.setLocalStorage(pageSizeKey, size);
    }

    public saveSortCriterion(sortCriterion: string) {
        this.sortCriterion.next(sortCriterion);
        this.setLocalStorage(sortCriterionKey, sortCriterion);
    }

    public saveSortOrder(sortOrder: string) {
        this.sortOrder.next(sortOrder);
        this.setLocalStorage(sortOrderKey, sortOrder);
    }

    private setLocalStorage(name: string, value: string): void {
        window.localStorage.setItem(name, value);
    }

    private getFromLocalStorage(name: string, defaultValue: string): string {
        const storedItem = window.localStorage.getItem(name);

        if (!storedItem) {
            window.localStorage.setItem(name, defaultValue);
            return defaultValue;
        }

        return storedItem;
    }
}
