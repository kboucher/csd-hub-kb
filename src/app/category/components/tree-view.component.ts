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
    selector: 'kb-category-tree-view',
    styleUrls: ['./tree-view.scss'],
    templateUrl: './tree-view.html',
})
export class TreeViewComponent implements OnInit {
    @Input() categories: Category[];
    @Input() selectedCategory?: Category;

    public isArticleState: boolean = false;
    public pageSize: number;
    public sortCriterion: string;
    public sortOrder: string;
    public unreadCount: number = 0;

    private $treeView: any;

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

        this.articleService.getCurrentCategory().subscribe((value) => {
            if (this.selectedCategory !== value) {
                this.updateSelectedCategory(value);
            }
        });

        this.appService.getPageSize().subscribe((value) => {
            this.pageSize = value;
        });

        this.appService.getSortCriterion().subscribe((value) => {
            this.sortCriterion = value;
        });

        this.appService.getSortOrder().subscribe((value) => {
            this.sortOrder = value;
        });

        /*
            Configures jstree to hide nodes that do not match the filter
            search string. May be source of performance issues on large
            trees or older browsers: https://www.jstree.com/api/#/?f=$.jstree.defaults.search.show_only_matches
        */
        $.jstree.defaults.search.show_only_matches = true;

        this.$treeView = $(treeSelector).on('select_node.jstree', function(e, data) {
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
            this.$treeView.jstree(true)
                .search($('#category-tree-filter-input').val());
        });
    }

    /*
        Handles external category changes triggered
        by subscription to observable on Article
        Service (Ex: from Article view, Carousel link
        or bookmarked URL.)
     */
    public updateSelectedCategory(category: Category) {
        if (this.selectedCategory) {
            this.selectedCategory.state.selected = false;
        }

        this.selectedCategory = category;

        if (this.$treeView && this.$treeView.jstree) {
            this.$treeView.jstree('deselect_all', true);
        }

        if (category) {
            category.state.opened = true;
            category.state.selected = true;

            this.$treeView.jstree('select_node', category, true);
        }
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
            size: this.pageSize,
            sortCriterion: this.sortCriterion,
            sortOrder: this.sortOrder,
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
