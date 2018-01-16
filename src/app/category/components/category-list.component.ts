import { Component, Input, OnInit } from '@angular/core';

import { ArticleService } from '../../article/services/article-service';
import { Category } from '../models/category';

@Component({
    providers: [ArticleService],
    selector: 'kb-category-list',
    styleUrls: ['./category-list.scss'],
    templateUrl: './category-list.html',
})
export class CategoryListComponent implements OnInit {
    @Input() categories: Category[];

    pageSize: number;
    selectedCategory: Category;
    unreadCount: number = 0;

    constructor(private articleService: ArticleService) {}

    ngOnInit() {
        this.pageSize = this.articleService.getPageSize();

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
