declare var $: any; // declare global jquery

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../models/category';
import { OnInit } from '@angular/core';

function findById(collection, id) {
    if (collection.length) {
        for (var i = 0; i < collection.length; i++) {
            if (collection[i].id == id) {
                return collection[i];
            }

            let found = findById(collection[i].children, id);
            if (found) return found;
        }
    }
};

@Component({
    selector: 'category-tree-view',
    templateUrl: './tree-view.html'
})
export class TreeViewComponent implements OnInit {
    @Input() categories: Array<Category>;
    @Input() selectedCategory: Category;
    @Output() onSelected = new EventEmitter();

    constructor() {}

    ngOnInit() {
        console.log('Categories tree-view component initialized with ' + this.categories.length + ' categories.');

        $('#category_tree').on('select_node.jstree', function(e, data) {
            let category = findById(this.categories, data.node.id);

            this.select(category);
        }.bind(this)).jstree({
            'core': {
                'data': this.categories
            }
        });
    }

    ngOnChanges() {
        //alert('Tree view onChanges fired!');
    }

    select(category: Category) {
        this.onSelected.emit({event, category});
    }
}
