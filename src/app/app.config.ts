/*
    Stores configurable values for various mechanisms within
    the Knowledge Base portlet application.
 */
const API_VERSION = 'v1';
const ARTICLE_LIST_PAGING_MAX = 7;
const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_SORT_CRITERION = 'date';
const DEFAULT_SORT_ORDER = 'desc';

export function getApiVersion(): string {
    return API_VERSION;
}

export function getArticleListPagingMax(): number {
    return ARTICLE_LIST_PAGING_MAX;
}

export function getDefaultPageSize(): number {
    return DEFAULT_PAGE_SIZE;
}

export function getDefaultSortCriterion(): string {
    return DEFAULT_SORT_CRITERION;
}

export function getDefaultSortOrder(): string {
    return DEFAULT_SORT_ORDER;
}
