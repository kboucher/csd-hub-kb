declare var $: any; // declare global jquery

import { Component, Input, OnInit } from '@angular/core';
import { UIRouter } from "@uirouter/angular";

import { Category } from '../../category/models/category';
import { Article } from '../models/article';
import { ArticleService } from '../services/article-service';

@Component({
    providers: [ArticleService],
    selector: 'article-list',
    templateUrl: './article-list.html'
})
export class ArticleListComponent implements OnInit {
    @Input() articles: Article[];
    @Input() categories: Category[];
    @Input() selectedCategory: Category;

    articlesColumn1: Array<Article>;
    articlesColumn2: Array<Article>;
    selectedArticle: Article;

    constructor(
        private _articleService: ArticleService,
        private uiRouter: UIRouter
    ) {}

    ngOnInit() {
        // Back to card view if no selected category (handles state issue with reload)
        if (!this.selectedCategory) {
            this.uiRouter.stateService.go('categories', null, { location: false });
        } else {
            // cut list into two columns
            if (this.articles) {
                if (this.articles.length === 1) {
                    this.articlesColumn1 = this.articles;
                    this.articlesColumn2 = [];
                } else if (this.articles.length > 1) {
                    let halfway = Math.round(this.articles.length / 2);
                    this.articlesColumn1 = this.articles.slice(0, halfway);
                    this.articlesColumn2 = this.articles.slice(halfway, this.articles.length);
                }
            }
        }
    }

    goBackToList() {
        this.selectedArticle = null;

        event.preventDefault();
    }

    onSelected($event) {
        this.uiRouter.stateService.go('categories.articles', {
            id: $event.category.id,
            selectedCategory: $event.category
        }, { location: false });
    }

    preventOrphans(string) {
        var stringArr = string.trim().split(' ');

        stringArr.splice(stringArr.length - 2, 0, '<span class="text-nowrap">');
        stringArr.push('</span>');

        return stringArr.join(' ');
    }

    viewArticle(articleId: number) {
        this._articleService.getArticleById(articleId).then((article) => {
            debugger;
        });

        event.preventDefault();
    }
}
