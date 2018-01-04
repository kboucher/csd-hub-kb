import { Component, Input, OnInit } from '@angular/core';
import { UIRouter } from '@uirouter/angular';

import { Category } from '../../category/models/category';
import { Article } from '../models/article';
import { ArticleService } from '../services/article-service';

@Component({
    providers: [ArticleService],
    selector: 'kb-article-list',
    styleUrls: ['./article-list.css'],
    templateUrl: './article-list.html',
})
export class ArticleListComponent implements OnInit {
    @Input() articlesResponse: any;
    @Input() categories: Category[];
    @Input() pageSize: number;
    @Input() selectedCategory?: Category;

    isArticleState: boolean = false;
    unreadCount: number = 0;
    articles: Article[];
    emptyMssg: string;
    emptyMssgIcon: string;
    page: number;
    pages: number[] = [];
    showPager: boolean;
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
        });
        this.uiRouter.transitionService.onExit({ exiting: '**.article' }, (trans) => {
            this.isArticleState = false;
        });

        this.articleService.getUnreadCount().then((unread) => {
            this.unreadCount = unread.unreadCount;
        });

        this.articles = this.articlesResponse.articles;
        this.page = this.articlesResponse.page;
        this.pageSize = this.articlesResponse.size;
        this.total = this.articlesResponse.total;
        this.showPager = this.total > this.pageSize;

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

    goToPage(options: any) {
        const state = this.selectedCategory ?
                'categories.articles' :
                'categories.unread-articles';
        const params = {
            categoryId: null,
            page: options.pageNum,
            size: options.pageSize,
        };

        if (this.selectedCategory) {
            params.categoryId = this.selectedCategory.id;
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
