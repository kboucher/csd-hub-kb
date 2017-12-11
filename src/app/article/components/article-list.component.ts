declare var $: any; // declare global jquery

import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../../category/models/category';
import { Article } from '../models/article';
import { ArticleService } from '../services/article-service';

@Component({
    providers: [ArticleService],
    selector: 'article-list',
    templateUrl: './article-list.html'
})
export class ArticleListComponent implements OnInit {
    @Input() selectedCategory: Category;

    articles: Array<Article>;
    articlesColumn1: Array<Article>;
    articlesColumn2: Array<Article>;
    selectedArticle: Article;

    constructor(private _articleService: ArticleService) {}

    ngOnInit() {
        console.log('Categories Articles component initialized with ' + this.selectedCategory);

        this._articleService.getArticlesByCategory(this.selectedCategory).then((response) => {
            debugger;

            // this.articles = response;

            // if (this.articles.length === 1) {
            //     this.articlesColumn1 = this.articles;
            // } else if (this.articles.length > 1) {
            //     let halfway = Math.round(this.articles.length / 2);
            //     this.articlesColumn1 = this.articles.slice(0, halfway);
            //     this.articlesColumn2 = this.articles.slice(halfway, this.articles.length);
            // }
        });
    }

    goBackToList() {
        this.selectedArticle = null;

        event.preventDefault();
    }

    preventOrphans(string) {
        var stringArr = string.trim().split(' ');

        stringArr.splice(stringArr.length - 2, 0, '<span class="text-nowrap">');
        stringArr.push('</span>');

        return stringArr.join(' ');
    }

    viewArticle(articleId: number) {
        this.selectedArticle = this._articleService.getArticleById(articleId);

        event.preventDefault();
    }
}
