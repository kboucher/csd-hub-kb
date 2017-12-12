declare var $:any;

import { Component, Input } from '@angular/core';
import { Category } from '../models/category';
import { OnInit } from '@angular/core';

import { CategoryService } from '../services/category-service';

/**
 *  Creates state objects for jstree
 */
function stateFactory() {
    return {
        disabled: false,
        opened: false,
        selected: false
    };
}

@Component({
    providers: [CategoryService],
    selector: 'category-list',
    templateUrl: './category-list.html'
})
export class CategoryListComponent implements OnInit {
    @Input() categories: Category[];

    selectedCategory: Category;

    constructor() {}

    ngOnInit() {
        // Add state objects for jstree plugin
        this.categories.forEach((_category) => {
            _category.state = stateFactory();
        });
    }

    select(category: Category) {
        category.state.opened = true;
        category.state.selected = true;
    }
}
