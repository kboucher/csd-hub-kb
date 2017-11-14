declare var $:any;

import { Component } from '@angular/core';
import { Article } from '../models/article';
import { OnInit } from '@angular/core';
import { ArticleService } from '../services/article-service';

@Component({
    selector: 'article-list',
    templateUrl: './article-list.html',
    providers: [ArticleService]
})
export class ArticleListComponent implements OnInit {
    selectedArticle: Article;
    articles: Array<Article>;

    constructor(private _articleService: ArticleService) {
        this.articles = _articleService.getArticles();
    }

    ngOnInit() {
        console.log(`Articles list component initialized with ${this.articles.length} articles.`);
    }

    onSelected($event) {
        this.selectedArticle = $event.article;
    }

    select(article: Article) {
        this.selectedArticle = article;
    }
}
