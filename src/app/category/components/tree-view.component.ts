declare var $: any; // declare global jquery

import { Component, Input, OnInit, ViewEncapsulation  } from '@angular/core';
import { UIRouter } from '@uirouter/angular';
import { Category } from '../models/category';

import { AppService } from '../../app-service';
import { ArticleService } from '../../article/services/article-service';
import { CategoryService } from '../services/category-service';

const treeSelector = '#category-tree';

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [AppService, ArticleService],
    selector: 'kb-category-tree-view',
    styleUrls: ['./tree-view.scss'],
    templateUrl: './tree-view.html',
})
export class TreeViewComponent implements OnInit {
    @Input() categories: Category[];
    @Input() selectedCategory: Category;
    @Input() pageSize: number;
    @Input() sortCriterion: string;
    @Input() sortOrder: string;

    public unreadCount: number = 0;
    public isArticleState: boolean = false;

    constructor(
        private articleService: ArticleService,
        private appService: AppService,
        private categoryService: CategoryService,
        private uiRouter: UIRouter,
    ) {}

    ngOnInit() {
        this.handleArticleState();
        this.updateUnreadCount();

        if (this.selectedCategory) {
            this.selectedCategory.state.opened = true;
            this.selectedCategory.state.selected = true;
        }

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

    /*
        Handles category tree-node click. Updates jsTree state previously
        selected category and newly selected category.

        @method select
        @param {Category} category CSD Hub Knowledge Base category object
        @public
     */
    select(category: Category) {
        if (this.selectedCategory) {
            this.selectedCategory.state.selected = false;
        }
        category.state.selected = true;

        this.uiRouter.stateService.go('categories.category.articles', {
            categoryId: category.id,
            page: 1,
            selectedCategory: category,
            size: this.appService.getPageSize(),
            sortCriterion: this.appService.getSortCriterion(),
            sortOrder: this.appService.getSortOrder(),
        }, { location: true });
    }

    /*
        Sets properties that handle the display of an article within
        the context of this parent (by state/route) module.

        @method handleArticleState
        @private
     */
    private handleArticleState() {
        // Handle direct links to articles
        if (/\.article$/.test(this.uiRouter.stateService.$current.name)) {
            this.isArticleState = true;
        }

        // Handle subsequents state changes between articles list and individual articles
        this.uiRouter.transitionService.onEnter({ entering: '**.article' }, (trans) => {
            this.isArticleState = true;
        });

        this.uiRouter.transitionService.onExit({ exiting: '**.article' }, (trans) => {
            /*
                TODO: Why does "exit" fire when we are merely retaining?
             */
            if (trans.$to().name !== 'categories.category.articles.article') {
                this.isArticleState = false;
            }
        });
    }

    /*
        Updates user's unread count via a call to the article service.

        @method updateUnreadCount
        @private
     */
    private updateUnreadCount() {
        this.articleService.getUnreadCount().then((unread) => {
            this.unreadCount = unread.unreadCount;
        });
    }
}
