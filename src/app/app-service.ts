declare var Liferay: any;

import { Injectable } from '@angular/core';
import * as config from './app.config';

const pageSizeKey = 'kbArticlesPageSize';
const sortCriterionKey = 'kbArticlesSortCriterion';
const sortOrderKey = 'kbArticlesSortOrder';

@Injectable()
export class AppService {

    public getPageSize(): number {
        const defaultPageSize = config.getDefaultPageSize();
        const pageSize = this.getFromLocalStorage(pageSizeKey, defaultPageSize.toString());

        return +pageSize;
    }

    public getSortCriterion(): string {
        return this.getFromLocalStorage(sortCriterionKey, config.getDefaultSortCriterion());
    }

    public getSortOrder(): string {
        return this.getFromLocalStorage(sortOrderKey, config.getDefaultSortOrder());
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
