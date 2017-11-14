declare var $: any; // declare global jquery

import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { Article } from '../../article/models/article';
import { ArticleService } from '../../article/services/article-service';

@Component({
    providers: [ArticleService],
    selector: 'category-articles',
    templateUrl: './category-articles.html'
})
export class CategoryArticlesComponent implements OnInit {
    @Input() selectedCategory: Category;

    articles: Array<Article>;

    constructor(private _articleService: ArticleService) {
        this.articles = _articleService.getArticlesByCategory(this.selectedCategory);
    }

    ngOnInit() {
        console.log('Categories Articles component initialized with ' + this.selectedCategory);
    }
}
