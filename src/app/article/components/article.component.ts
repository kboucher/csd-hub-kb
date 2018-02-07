import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Category } from '../../category/models/category';
import { Article } from '../models/article';

@Component({
    providers: [TranslateService],
    selector: 'kb-article',
    styleUrls: ['./article.scss'],
    templateUrl: './article.html',
})
export class ArticleComponent implements OnInit {
    @Input() article?: Article;
    @Input() category?: Category;
    @Input() pageNum?: number;
    @Input() pageSize?: number;
    @Input() sortCriterion?: string;
    @Input() sortOrder?: string;

    public isError: boolean = false;
    public errorMessage: string = null;

    constructor(private translate: TranslateService) {}

    ngOnInit() {
        // Handle article fetch errors
        if (this.article.error) {
            this.isError = true;

            if (this.article.error.status === 403) {
                this.translate.get('STRINGS.errors.articleAndUnreadCount403').subscribe((res) => {
                    this.errorMessage = res;
                });
            } else if (this.article.error.status === 404) {
                this.translate.get('STRINGS.errors.articleAndUnreadCount404').subscribe((res) => {
                    this.errorMessage = res;
                });
            } else if (this.article.error.status === 406) {
                this.translate.get('STRINGS.errors.articleAndUnreadCount406').subscribe((res) => {
                    this.errorMessage = res;
                });
            } else if (this.article.error.status === 500) {
                this.translate.get('STRINGS.errors.articleAndUnreadCount500').subscribe((res) => {
                    this.errorMessage = res;
                });
            } else if (this.article.error.status === 503) {
                this.translate.get('STRINGS.errors.articleAndUnreadCount503').subscribe((res) => {
                    this.errorMessage = res;
                });
            } else {
                this.translate.get('STRINGS.errors.unknown').subscribe((res) => {
                    this.errorMessage = res;
                });
            }
        }
    }
}
