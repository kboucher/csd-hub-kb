import { Component, Input, OnInit } from '@angular/core';
import { UIRouter } from '@uirouter/angular';

import { Category } from '../../category/models/category';
import { Article } from '../models/article';
import { ArticleService } from '../services/article-service';

@Component({
    providers: [ArticleService],
    selector: 'unread-articles',
    templateUrl: './unread-articles.html'
})
export class UnreadArticlesComponent implements OnInit {
    @Input() articlesResponse: any;

    articles: Article[];
    unreadCount: number = 0;
    selectedArticle: Article;

    constructor(
        private _articleService: ArticleService,
        private _uiRouter: UIRouter
    ) {}

    ngOnInit() {
        this.articles = this.articlesResponse.articles;

        // TODO: Remove this if we don't want to show this link in this view
        this._articleService.getUnreadCount().then((unread) => {
            this.unreadCount = unread.unreadCount;
        });
    }

    goBackToList() {
        this.selectedArticle = null;

        event.preventDefault();
    }

    viewArticle(articleId: number) {
        this._articleService.getArticleById(articleId).then((article) => {
            this.selectedArticle = article;
        });

        event.preventDefault();
    }
}
