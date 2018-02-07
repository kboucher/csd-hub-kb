declare var $: any;

import { Component, Input, OnInit } from '@angular/core';

import { AppService } from '../../app-service';
import { ArticleService } from '../../article/services/article-service';
import { Category } from '../models/category';

@Component({
    providers: [AppService, ArticleService],
    selector: 'kb-category-list',
    styleUrls: ['./category-list.scss'],
    templateUrl: './category-list.html',
})
export class CategoryListComponent implements OnInit {
    @Input() categories: Category[];

    public pageSize: number;
    public sortCriterion: string;
    public sortOrder: string;
    public unreadCount: number = 0;

    constructor(
        private appService: AppService,
        private articleService: ArticleService,
    ) {}

    ngOnInit() {
        this.pageSize = this.appService.getPageSize();
        this.sortCriterion = this.appService.getSortCriterion();
        this.sortOrder = this.appService.getSortOrder();

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
