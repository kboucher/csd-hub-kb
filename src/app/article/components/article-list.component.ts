import { Component, Input, OnInit } from '@angular/core';
import { UIRouter } from '@uirouter/angular';

import { Category } from '../../category/models/category';
import { Article } from '../models/article';
import { ArticleService } from '../services/article-service';

@Component({
    providers: [ArticleService],
    selector: 'article-list',
    templateUrl: './article-list.html'
})
export class ArticleListComponent implements OnInit {
    @Input() articlesResponse: any;
    @Input() categories: Category[];
    @Input() pageSize: number;
    @Input() selectedCategory: Category;

    articles: Article[];
    emptyMssg: string;
    page: number;
    pages: number[] = [];
    showPager: boolean;
    total: number;
    unreadCount: number = 0;

    constructor(
        private _articleService: ArticleService,
        private _uiRouter: UIRouter
    ) {}

    ngOnInit() {
        this._articleService.getUnreadCount().then((unread) => {
            this.unreadCount = unread.unreadCount;
        });

        this.selectedCategory.state.selected = true;
        this.selectedCategory.state.opened = true;

        this.articles = this.articlesResponse.articles;
        this.page = this.articlesResponse.page;
        this.pageSize = this.articlesResponse.size;
        this.total = this.articlesResponse.total;
        this.showPager = this.total > this.pageSize;

        this.emptyMssg = 'There are currently no <strong>' +
                this.selectedCategory.text +
                '</strong> articles available.';

        for (let i = 0; i < Math.ceil(this.total / this.pageSize); i++) {
            this.pages.push(i + 1);
        }
    }

    goToPage(options: any) {
        this._uiRouter.stateService.go('categories.articles',
            {
                categoryId: this.selectedCategory.id,
                page: options.pageNum,
                size: options.pageSize
            },
            { location: true }
        );
    }

    // Handles category tree-view click
    onSelected($event) {
        this.selectedCategory = $event.category;

        this._uiRouter.stateService.go('categories.articles', {
            categoryId: $event.category.id,
            selectedCategory: $event.category,
            page: 1,
            size: this.pageSize
        }, { location:true });
    }
}
