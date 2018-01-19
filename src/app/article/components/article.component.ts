import { Component, Input, OnInit } from '@angular/core';

import { Category } from '../../category/models/category';
import { Article } from '../models/article';

@Component({
    selector: 'kb-article',
    styleUrls: ['./article.scss'],
    templateUrl: './article.html',
})
export class ArticleComponent implements OnInit {
    @Input() article?: Article;
    @Input() category?: Category;
    @Input() pageNum?: number;
    @Input() pageSize?: number;

    public isError: boolean = false;
    public errorMessage: string = null;

    ngOnInit() {
        // Handle article fetch errors
        if (this.article.error) {
            this.isError = true;
            this.errorMessage = JSON.parse(this.article.error._body).message;
        }
    }
}
