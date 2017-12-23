import { Component, Input } from '@angular/core';

import { Category } from '../../category/models/category';
import { Article } from '../models/article';

@Component({
    selector: 'article',
    styleUrls: ['./article.css'],
    templateUrl: './article.html',
})
export class ArticleComponent {
    @Input() article: Article;
    @Input() category: Category;
}
