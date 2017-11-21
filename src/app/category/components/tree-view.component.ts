declare var $: any; // declare global jquery

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../models/category';
import { OnInit } from '@angular/core';

const treeSelector = '#category-tree';

/**
    Recursively searches multidimensional array of objects
    to find one with a particular ID value.
 */
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
        /*
            Configures jstree to hide nodes that do not match the filter
            search string. May be source of performance issues on large
            trees or older browsers: https://www.jstree.com/api/#/?f=$.jstree.defaults.search.show_only_matches
        */
        $.jstree.defaults.search.show_only_matches = true;

        $(treeSelector).on('select_node.jstree', function(e, data) {
            let category = findById(this.categories, data.node.id);

            this.select(category);
        }.bind(this)).jstree({
            'core': {
                'data': this.categories
            },
            'plugins': [ 'search' ]
        });

        /*
            Initializes tree view filter, can also be amended to process
            on form submit instead of keyup event.
        */
        $("#category-tree-filter-input").keyup(function(e) {
            $(treeSelector).jstree(true).search($("#category-tree-filter-input").val());
        });
    }

    select(category: Category) {
        this.onSelected.emit({event, category});
    }
}
