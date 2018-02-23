declare var $: any;

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AppService } from '../../app-service';
import { ArticleService } from '../../article/services/article-service';
import { Category } from '../models/category';

@Component({
    selector: 'kb-category-list',
    styleUrls: ['./category-list.scss'],
    templateUrl: './category-list.html',
})
export class CategoryListComponent implements OnInit {
    @Input() categories?: Category[];

    public errorMessage: string = null;
    public isError: boolean = false;
    public pageSize: number;
    public sortCriterion: string;
    public sortOrder: string;
    public unreadCount: number = 0;

    constructor(
        private appService: AppService,
        private articleService: ArticleService,
        private translate: TranslateService,
    ) {}

    ngOnInit() {
        /* tslint:disable no-string-literal */
        if (this.categories['error']) {
            this.isError = true;

            if (this.categories['error'].status === 403) {
                this.translate.get('STRINGS.errors.categoryList403').subscribe((res) => {
                    this.errorMessage = res;
                });
            } else if (this.categories['error'].status === 500) {
                this.translate.get('STRINGS.errors.categoryList500').subscribe((res) => {
                    this.errorMessage = res;
                });
            } else {
                this.translate.get('STRINGS.errors.unknown').subscribe((res) => {
                    this.errorMessage = res;
                });
            }
        }
        /* tslint:enable */

        this.appService.getPageSize().subscribe((value) => {
            this.pageSize = value;
        });
        this.appService.getSortCriterion().subscribe((value) => {
            this.sortCriterion = value;
        });
        this.appService.getSortOrder().subscribe((value) => {
            this.sortOrder = value;
        });

        this.articleService.getUnreadCount().then((unread) => {
            this.unreadCount = unread.unreadCount;
        });
    }

    /*
        Handles category card click. Sets initial jsTree state and
        scrolls page to top of the Knowledge Base portlet.

        @method select
        @param {Category} category CSD Hub Knowledge Base category object
        @public
     */
    select(category: Category) {
        category.state.opened = true;
        category.state.selected = true;

        $('html, body').animate({
            scrollTop: $('#portlet_bcbsal_csd_knowledgeBase').offset().top,
        }, 500);
    }
}
