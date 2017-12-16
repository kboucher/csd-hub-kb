import { Component, Input } from '@angular/core';

import { Article } from '../models/article';
import { Category } from '../../category/models/category';

@Component({
    selector: 'article',
    templateUrl: './article.html'
})
export class ArticleComponent {
    @Input() article: Article;
    @Input() category: Category;
}
