import { Component, Input, OnInit } from '@angular/core';

import { ArticleService } from '../../article/services/article-service';
import { Category } from '../models/category';
import { CategoryService } from '../services/category-service';

@Component({
    providers: [ArticleService],
    selector: 'kb-category-list',
    styleUrls: ['./category-list.css'],
    templateUrl: './category-list.html',
})
export class CategoryListComponent implements OnInit {
    @Input() categories: Category[];

    pageSize: number;
    selectedCategory: Category;

    constructor(
        private articleSvc: ArticleService,
        private categoryService: CategoryService,
    ) {}

    ngOnInit() {
        this.pageSize = this.articleSvc.getPageSize();
    }

    // Handles category card click
    select(category: Category) {
        this.selectedCategory = category;

        category.state.opened = true;
        category.state.selected = true;
    }
}
