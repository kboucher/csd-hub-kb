declare var $: any; // declare global jquery

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
    @Input() selectedCategory: Category;

    articles: Article[];
    page: number;
    pages: number[] = [];
    pageSize: number;
    selectedArticle: Article;
    showPager: boolean;
    total: number;

    constructor(
        private _articleService: ArticleService,
        private _uiRouter: UIRouter
    ) {}

    ngOnInit() {
        // Back to card view if no selected category (handles state issue with reload)
        if (!this.selectedCategory) {
            this._uiRouter.stateService.go('categories', null, { location: true });
        } else {
            this.articles = this.articlesResponse.articles;
            this.page = this.articlesResponse.page;
            this.pageSize = this.articlesResponse.size;
            this.total = this.articlesResponse.total;
            this.showPager = this.total > this.pageSize;

            for (let i = 0; i < Math.ceil(this.total / this.pageSize); i++) {
                this.pages.push(i + 1);
            }
        }
    }

    goToPage(pageNum: number) {
        this._articleService.getArticlesByCategory(this.selectedCategory.id, {
            page: pageNum,
            size: this.pageSize
        }).then((response: any) => {
            this.articles = response.articles;
            this.page = response.page;
            this.pageSize = response.size;
        });
    }
}
