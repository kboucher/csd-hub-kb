import { Component, Input, OnInit } from '@angular/core';
import { UIRouter } from '@uirouter/angular';

import * as config from '../../app.config';
import { Category } from '../../category/models/category';
import { Article } from '../models/article';
import { ArticleService } from '../services/article-service';

@Component({
    providers: [ArticleService],
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

    isArticleState: boolean = false;
    selectedArticleId: string = null;
    unreadCount: number = 0;
    articles: Article[];
    emptyMssg: string;
    emptyMssgIcon: string;
    page: number;
    pagerDisplayMax: number = config.getArticleListPagingMax();
    pages: number[] = [];
    sortOptions: any[] = [
        {id: 'date', name: 'Date'},
        {id: 'title', name: 'Title'},
    ];
    total: number;

    constructor(
        private articleService: ArticleService,
        private uiRouter: UIRouter,
    ) {}

    ngOnInit() {
        // Handle direct links to articles
        if (/\.article$/.test(this.uiRouter.stateService.$current.name)) {
            this.isArticleState = true;
        }

        // Handle subsequents state changes between articles list and individual articles
        this.uiRouter.transitionService.onEnter({ entering: '**.article' }, (trans) => {
            this.isArticleState = true;
            this.selectedArticleId = trans.params().articleId;
        });
        this.uiRouter.transitionService.onExit({ exiting: '**.article' }, (trans) => {
            /*
                TODO: Why does "exit" fire when we are merely retaining?
             */
            if (trans.$to().name !== 'categories.articles.article') {
                this.isArticleState = false;
            }
        });

        this.uiRouter.transitionService.onExit({ exiting: 'categories.articles' }, (trans) => {
            if (this && this.selectedCategory) {
                this.selectedCategory.state.selected = false;
            }
        });

        this.articleService.getUnreadCount().then((unread) => {
            this.unreadCount = unread.unreadCount;
        });

        this.articles = this.articlesResponse.articles;
        this.page = this.articlesResponse.page;
        this.pageSize = this.articlesResponse.size;
        this.total = this.articlesResponse.total;

        // Handle category vs. unread-articles lists
        if (this.selectedCategory) {
            this.selectedCategory.state.selected = true;
            this.selectedCategory.state.opened = true;

            this.emptyMssg = 'There are currently no <strong>' +
                    this.selectedCategory.text +
                    '</strong> articles available.';
            this.emptyMssgIcon = 'icon-folder-open-alt';
        } else {
            this.emptyMssg = 'You\'re all caught up on unread articles!';
            this.emptyMssgIcon = 'icon-thumbs-up';
        }

        for (let i = 0; i < Math.ceil(this.total / this.pageSize); i++) {
            this.pages.push(i + 1);
        }
    }

    changeSort(options: any) {
        if (options.sortCriterion === this.sortCriterion && options.sortOrder === this.sortOrder) {
            return false;
        }

        const state = this.selectedCategory ?
                'categories.articles' :
                'categories.unread';

        this.uiRouter.stateService.go(state, {
            page: this.page,
            size: this.pageSize,
            sortCriterion: options.sortCriterion,
            sortOrder: options.sortOrder,
        }, { location: true });
    }

    goToPage(options: any) {
        const params = {
            articleId: null,
            categoryId: null,
            page: options.pageNum,
            size: options.pageSize,
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
                'categories.articles' :
                'categories.unread';

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

    // Handles category tree-view click
    onSelected($event) {
        this.selectedCategory = $event.category;

        this.uiRouter.stateService.go('categories.articles', {
            categoryId: $event.category.id,
            selectedCategory: $event.category,
            page: 1,
            size: this.pageSize,
        }, { location: true });
    }
}
