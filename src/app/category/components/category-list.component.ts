import { Component, Input, OnInit } from '@angular/core';
import * as config from '../../app.config';

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
    public selectedCategory: Category;
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

    // Handles category card click
    select(category: Category) {
        this.selectedCategory = category;

        category.state.opened = true;
        category.state.selected = true;
    }
}
