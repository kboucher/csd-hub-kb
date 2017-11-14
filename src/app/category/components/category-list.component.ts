declare var $:any;

import { Component } from '@angular/core';
import { Category } from '../models/category';
import { OnInit } from '@angular/core';
import { CategoryService } from '../services/category-service';

@Component({
    providers: [CategoryService],
    selector: 'category-list',
    templateUrl: './category-list.html'
})
export class CategoryListComponent implements OnInit {
    selectedCategory: Category;
    categories: Array<Category>;

    constructor(private _categoryService: CategoryService) {
        this.categories = _categoryService.getCategories();
    }

    ngOnInit() {
        console.log(`Categories list component initialized with ${this.categories.length} categories.`);
    }

    onSelected($event) {
        this.selectedCategory = $event.category;
    }

    select(category: Category) {
        category.state.opened = true;
        category.state.selected = true;
        this.selectedCategory = category;
    }
}
