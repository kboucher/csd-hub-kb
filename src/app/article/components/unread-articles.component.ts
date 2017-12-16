import { Component, Input } from '@angular/core';
import { UIRouter } from '@uirouter/angular';

import { Category } from '../../category/models/category';
import { Article } from '../models/article';
import { ArticleService } from '../services/article-service';

@Component({
    providers: [ArticleService],
    selector: 'unread-articles',
    templateUrl: './unread-articles.html'
})
export class UnreadArticlesComponent {
    @Input() articles: Article[];

    selectedArticle: Article;

    constructor(
        private _articleService: ArticleService,
        private _uiRouter: UIRouter
    ) {}

    goBackToList() {
        this.selectedArticle = null;

        event.preventDefault();
    }

    onSelected($event) {
        this._uiRouter.stateService.go('categories.articles', {
            id: $event.category.id,
            selectedCategory: $event.category
        }, { location: true });
    }

    viewArticle(articleId: number) {
        this._articleService.getArticleById(articleId).then((article) => {
            this.selectedArticle = article;
        });

        event.preventDefault();
    }
}
