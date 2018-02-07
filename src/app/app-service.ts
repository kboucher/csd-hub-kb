declare var Liferay: any;

import { Injectable } from '@angular/core';
import { AppConfig } from '../config/app.config';

const pageSizeKey = 'kbArticlesPageSize';
const sortCriterionKey = 'kbArticlesSortCriterion';
const sortOrderKey = 'kbArticlesSortOrder';

@Injectable()
export class AppService {
    private defaultPageSize: number;
    private defaultSortCriterion: string;
    private defaultSortOrder: string;

    constructor(private appConfig: AppConfig) {
        this.defaultPageSize = appConfig.getEntryByKey('DEFAULT_PAGE_SIZE');
        this.defaultSortCriterion = appConfig.getEntryByKey('DEFAULT_SORT_CRITERION');
        this.defaultSortOrder = appConfig.getEntryByKey('DEFAULT_SORT_ORDER');
    }

    public getPageSize(): number {
        const pageSize = this.getFromLocalStorage(pageSizeKey, this.defaultPageSize.toString());

        return +pageSize;
    }

    public getSortCriterion(): string {
        return this.getFromLocalStorage(sortCriterionKey, this.defaultSortCriterion);
    }

    public getSortOrder(): string {
        return this.getFromLocalStorage(sortOrderKey, this.defaultSortOrder);
    }

    public savePageSize(size: string) {
        this.setLocalStorage(pageSizeKey, size);
    }

    public saveSortCriterion(sortCriterion: string) {
        this.setLocalStorage(sortCriterionKey, sortCriterion);
    }

    public saveSortOrder(sortOrder: string) {
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
