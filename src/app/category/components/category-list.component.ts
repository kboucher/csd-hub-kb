declare var $:any;

import { Component, Input } from '@angular/core';
import { Category } from '../models/category';
import { OnInit } from '@angular/core';

import { CategoryService } from '../services/category-service';

@Component({
    providers: [CategoryService],
    selector: 'category-list',
    templateUrl: './category-list.html'
})
export class CategoryListComponent implements OnInit {
    @Input() categories: Category[];

    selectedCategory: Category;

    constructor() {}

    /**
        Recurses over categories and children to add
        jsTree state objects.

        @method addStates
        @param {Array<Category>} categories Array of Category objects that need state added.
     */
    private addStates(categories: Category[]) {
        function stateFactory() {
            return {
                disabled: false,
                opened: false,
                selected: false
            };
        }

        for (let i = 0; i < categories.length; i++) {
            categories[i].state = stateFactory();
            if (categories[i].children.length) {
                this.addStates(categories[i].children);
            }
        }
    }

    ngOnInit() {
        if (this.categories.length) {
            this.addStates(this.categories);
        }
    }

    select(category: Category) {
        category.state.opened = true;
        category.state.selected = true;
    }
}
