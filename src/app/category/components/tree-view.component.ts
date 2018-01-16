declare var $: any; // declare global jquery

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation  } from '@angular/core';
import { Category } from '../models/category';
import { CategoryService } from '../services/category-service';

const treeSelector = '#category-tree';

@Component({
    selector: 'kb-category-tree-view',
    styleUrls: ['./tree-view.scss'],
    templateUrl: './tree-view.html',
    encapsulation: ViewEncapsulation.None,
})
export class TreeViewComponent implements OnInit {
    @Input() categories: Category[];
    @Input() selectedCategory: Category;
    @Output() selected = new EventEmitter();

    constructor(private categoryService: CategoryService) {}

    ngOnInit() {
        /*
            Configures jstree to hide nodes that do not match the filter
            search string. May be source of performance issues on large
            trees or older browsers: https://www.jstree.com/api/#/?f=$.jstree.defaults.search.show_only_matches
        */
        $.jstree.defaults.search.show_only_matches = true;

        $(treeSelector).on('select_node.jstree', function(e, data) {
            const category = this.categoryService.findById(this.categories, data.node.id);

            this.select(category);
        }.bind(this)).jstree({
            core: {
                data: this.categories,
            },
            plugins: [ 'search' ],
        });

        /*
            Initializes tree view filter, can also be amended to process
            on form submit instead of keyup event.
        */
        $('#category-tree-filter-input').keyup((e) => {
            $(treeSelector).jstree(true).search($('#category-tree-filter-input').val());
        });
    }

    select(category: Category) {
        if (this.selectedCategory) {
            this.selectedCategory.state.selected = false;
        }
        category.state.selected = true;
        this.selected.emit({event, category});
    }
}
