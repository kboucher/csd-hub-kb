import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { ArticleService } from '../../article/services/article-service';

@Component({
    providers: [ArticleService],
    selector: 'category-list',
    templateUrl: './category-list.html'
})
export class CategoryListComponent implements OnInit {
    @Input() categories: Category[];

    pageSize: number;
    selectedCategory: Category;

    constructor(private _articleSvc: ArticleService) {}

    ngOnInit() {
        this.pageSize = this._articleSvc.getPageSize();
    }

    // Handles category card click
    select(category: Category) {
        this.selectedCategory = category;

        category.state.opened = true;
        category.state.selected = true;
    }
}
