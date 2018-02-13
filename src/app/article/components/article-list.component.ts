/*
    Primary component responsible for the display of article lists
    and is the parent component of the singular article view component.

    @module ArticleListComponent
 */

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UIRouter } from '@uirouter/angular';

import { AppConfig } from '../../../config/app.config';
import { Category } from '../../category/models/category';
import { Article } from '../models/article';

@Component({
    providers: [TranslateService],
    selector: 'kb-article-list',
    styleUrls: ['./article-list.scss'],
    templateUrl: './article-list.html',
})
export class ArticleListComponent implements OnInit {
    @Input() articleId: string = null;
    @Input() articlesResponse: any;
    @Input() categories: Category[];
    @Input() pageSize: number;
    @Input() selectedCategory?: Category;
    @Input() sortCriterion: string;
    @Input() sortOrder: string;

    public articles: Article[];
    public emptyMssg: string;
    public emptyMssgIcon: string;
    public errorMessage: string = null;
    public isArticleState: boolean = false;
    public isError: boolean = false;
    public page: number;
    public pagerDisplayMax: number;
    public pages: number[] = [];
    public selectedArticleId: string = null;
    public sortOptions: any[];
    public total: number;

    constructor(
        private appConfig: AppConfig,
        private translate: TranslateService,
        private uiRouter: UIRouter,
    ) {
        this.pagerDisplayMax = appConfig.getEntryByKey('ARTICLE_LIST_PAGING_MAX');
    }

    ngOnInit() {
        this.handleListErrors(this.articlesResponse);
        this.handleArticleState();
        this.resetCategoryOnExit();

        if (!this.isError) {
            this.setupList(this.articlesResponse);
            this.handleInvalidPage();
            this.setupCategory();
        }
    }

    /*
        Updates articles list router state to modify sort preferences. Is no-op
        if the requested sorting change matches the current sorting options.

        @method changeSort
        @param {Object} options Hash containing property values specifying the
                        desired sort criterion and order.
        @public
     */
    public changeSort(options: any) {
        if (options.sortCriterion === this.sortCriterion && options.sortOrder === this.sortOrder) {
            return false;
        }

        const state = this.selectedCategory ?
                'categories.category.articles' :
                'categories.category.unread';

        this.uiRouter.stateService.go(state, {
            page: this.page,
            size: this.pageSize,
            sortCriterion: options.sortCriterion,
            sortOrder: options.sortOrder,
        }, { location: true });
    }

    /*
        Updates articles list router state to modify paging preferences.

        @method goToPage
        @param {Object} options Hash containing property values specifying the
                        desired page number and page size.
        @public
     */
    public goToPage(options: any) {
        const params = {
            articleId: null,
            categoryId: null,
            page: options.pageNum,
            size: options.pageSize,
            sortCriterion: this.sortCriterion,
            sortOrder: this.sortOrder,
        };

        /*
            TODO: This is a hack to maintain the article view while
            navigating the articles list. On the first pass, the @Input
            (articleId) is undefined, on subsequent passes, the manually
            set member (selctedArticleId) inexplicably becomes null, even
            though it is being set in the transition lifecycle handlers
            defined in the ngOnInit() above.
         */
        const articleId = this.selectedArticleId || this.articleId;

        let state = this.selectedCategory ?
                'categories.category.articles' :
                'categories.category.unread';

        if (this.selectedCategory) {
            params.categoryId = this.selectedCategory.id;
        }

        /*
            Checking both ID and state to prevent re-presentation of
            an article after closing it and then changing pages.
         */
        if (articleId && this.isArticleState) {
            params.articleId = articleId;
            state = state + '.article';
        }

        this.uiRouter.stateService.go(state, params, { location: true });
    }

    /*
        Handles category tree-view (jsTree) node click.

        @method onSelected
        @param {Object} $event jQuery event object
        @public
     */
    public onSelected($event) {
        this.selectedCategory = $event.category;

        this.uiRouter.stateService.go('categories.category.articles', {
            categoryId: $event.category.id,
            page: 1,
            selectedCategory: $event.category,
            size: this.pageSize,
            sortCriterion: this.sortCriterion,
            sortOrder: this.sortOrder,
        }, { location: true });
    }

    /*
        Handles API errors returned from the article-service.

        @method handleListErrors
        @param {Object} response UI Router app module's article response object
        @private
     */
    private handleListErrors(response) {
        if (response.error) {
            this.isError = true;

            if (response.error.status === 404) {
                this.translate.get('STRINGS.errors.categoryArticles404').subscribe((res) => {
                    this.errorMessage = res;
                });
            } else if (response.error.status === 403) {
                this.translate.get('STRINGS.errors.categoryArticles403').subscribe((res) => {
                    this.errorMessage = res;
                });
            } else {
                this.translate.get('STRINGS.errors.unknown').subscribe((res) => {
                    this.errorMessage = res;
                });
            }
        }
    }

    /*
        Sets properties that handle the display of an article within
        the context of this parent (by state/route) module.

        @method handleArticleState
        @private
     */
    private handleArticleState() {
        // Handle direct links to articles
        if (/\.article$/.test(this.uiRouter.stateService.$current.name)) {
            this.isArticleState = true;
        }

        // Handle subsequents state changes between articles list and individual articles
        this.uiRouter.transitionService.onEnter({ entering: '**.article' }, (trans) => {
            this.isArticleState = true;
            this.selectedArticleId = trans.params().articleId;

            // mark as read
            const listItem = this.articles.find((item) => {
                return item.id.toString() === this.selectedArticleId;
            });

            if (listItem) {
                listItem.read = true;
            }
        });

        this.uiRouter.transitionService.onExit({ exiting: '**.article' }, (trans) => {
            /*
                TODO: Why does "exit" fire when we are merely retaining?
             */
            if (trans.$to().name !== 'categories.category.articles.article') {
                this.isArticleState = false;
            }
        });
    }

    /*
        Redirects users to the first page of articles for the selected category
        if there are no articles present on the requested page.

        @method handleInvalidPage
        @private
     */
    private handleInvalidPage() {
        if (!this.articles.length && this.page > 1) {
            let redirState = this.selectedCategory ?
                'categories.category.articles' :
                'categories.category.unread';

            if (this.isArticleState && this.articleId !== null) {
                redirState = redirState + '.article';
            }

            this.uiRouter.stateService.go(redirState, {
                articleId: this.articleId || null,
                page: 1,
                size: this.pageSize,
                sortCriterion: this.sortCriterion,
                sortOrder: this.sortOrder,
            }, { location: true });
        }
    }

    /*
        Resets the `selected` state on the currently selected category
        when exiting the articles list. (Prevents multiple tree nodes
        from appearing to be selected when re-entering this list).

        @method resetCategoryOnExit
        @private
     */
    private resetCategoryOnExit() {
        this.uiRouter.transitionService.onExit({ exiting: 'categories.category.articles' }, (trans) => {
            if (this && this.selectedCategory) {
                this.selectedCategory.state.selected = false;
            }
        });
    }

    /*
        Initializes selected category for tree-view display and
        sets up different empty list messages for unread vs.
        category listings.

        @method setupCategory
        @private
     */
    private setupCategory() {
        if (this.selectedCategory) {
            this.selectedCategory.state.selected = true;
            this.selectedCategory.state.opened = true;

            this.emptyMssgIcon = 'icon-folder-open-alt';
            this.translate.get('STRINGS.articles.noArticlesInCategory', { category: this.selectedCategory.text })
                .subscribe((res: string) => {
                    this.emptyMssg = res;
                });
        } else {
            this.emptyMssgIcon = 'icon-thumbs-up';
            this.translate.get('STRINGS.articles.noMoreUnread')
                .subscribe((res: string) => {
                    this.emptyMssg = res;
                });
        }
    }

    /*
        Sets component's articles property from the provided API response
        and sets up properties required for paging functionality.

        @method setupList
        @param {Object} response UI Router app module's article response object
        @private
     */
    private setupList(response) {
        this.articles = response.articles;
        this.page = response.page;
        this.pageSize = response.size;
        this.total = response.total;

        this.translate.get(['STRINGS.app.date', 'STRINGS.app.title']).subscribe((res) => {
            this.sortOptions = [
                {id: 'date', name: res['STRINGS.app.date'] },
                {id: 'title', name: res['STRINGS.app.title'] },
            ];
        });

        for (let i = 0; i < Math.ceil(this.total / this.pageSize); i++) {
            this.pages.push(i + 1);
        }
    }
}
