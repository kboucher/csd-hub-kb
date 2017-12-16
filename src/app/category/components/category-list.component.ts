declare var $:any;

import { Component, Input, OnInit } from '@angular/core';
import { UIRouter } from '@uirouter/angular';

import { Category } from '../models/category';
import { CategoryService } from '../services/category-service';

@Component({
    providers: [CategoryService],
    selector: 'category-list',
    templateUrl: './category-list.html'
})
export class CategoryListComponent implements OnInit {
    @Input() categories: Category[];

    selectedCategory: Category;

    constructor(
        private _uiRouter: UIRouter
    ) {}

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

    // Handles category tree-view click
    onSelected($event) {
        this.selectedCategory = $event.category;

        this._uiRouter.stateService.go('categories.articles', {
            categoryId: $event.category.id,
            selectedCategory: $event.category
        }, { location:true });
    }

    // Handles category card click
    select(category: Category) {
        this.selectedCategory = category;

        category.state.opened = true;
        category.state.selected = true;
    }
}
