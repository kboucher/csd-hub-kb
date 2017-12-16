import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AnonymousUserComponent } from './authentication/anonymous-user.component';
import { ArticleListComponent } from './article/components/article-list.component';
import { ArticleComponent } from './article/components/article.component';
import { CategoryListComponent } from './category/components/category-list.component';
import { TreeViewComponent } from './category/components/tree-view.component';
import { UnreadArticlesComponent } from './article/components/unread-articles.component';
import { Paginator } from './paginator/paginator.component';
import { CategoryService } from './category/services/category-service';
import { ArticleService } from './article/services/article-service';
import { PreventOrphansPipe } from './pipes/prevent-orphans.pipe';
import { SafePipe } from './pipes/safe.pipe';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UIRouterModule, Transition } from '@uirouter/angular';
import { uiRouterConfigFn } from './app.routerconfig';

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

let anonymousUserState = {
    name: 'anonymous-user',
    url: '/anonymous-user',
    component: AnonymousUserComponent,
    views: {
        '!$default': { component: AnonymousUserComponent }
    }
};

let categoriesState = {
    name: 'categories',
    url: '/categories',
    resolve: [
        {
            token: 'categories',
            deps: [CategoryService],
            resolveFn: (categoryService) => categoryService.getCategories()
        }
    ],
    views: {
        "!$default": { component: CategoryListComponent }
    }
};

let articlesState = {
    name: 'categories.articles',
    url: '/:categoryId/articles',
    resolve: [
        {
            token: 'articlesResponse',
            deps: [Transition, ArticleService],
            resolveFn: (trans, articleService) => {
                return articleService.getArticlesByCategory(trans.params().categoryId, { page: 1, size: 2 });
            }
        }, {
            token: 'selectedCategory',
            deps: [Transition, CategoryService, 'categories'],
            resolveFn: (trans, categoryService, categories) => {
                return categoryService.findById(categories, trans.params().categoryId);
            }
        }
    ],
    views: {
        "^.articles": { component: ArticleListComponent }
    }
};

let unreadArticlesState = {
    name: 'unread-articles',
    url: '/unread-articles',
    component: UnreadArticlesComponent,
    resolve: [
        {
            token: 'articles',
            deps: [ArticleService],
            resolveFn: (articleService) => articleService.getUnreadArticles()
        }
    ],
    views: {
        "!$default": { component: UnreadArticlesComponent }
    }
};

let articleState = {
    name: 'categories.articles.article',
    url: '/:articleId',
    resolve: [
        {
            token: 'article',
            deps: [Transition, ArticleService],
            resolveFn: (trans, articleService) => articleService.getArticleById(trans.params().articleId)
        }, {
            token: 'category',
            deps: [Transition, CategoryService, 'categories'],
            resolveFn: (trans, categoryService, categories) => {
                return categoryService.findById(categories, trans.params().categoryId);
            }
        }
    ],
    views: {
        "^.^.articles": { component: ArticleComponent }
    }
};

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        UIRouterModule.forRoot({
            states: [
                anonymousUserState,
                articleState,
                articlesState,
                categoriesState,
                unreadArticlesState
            ],
            config: uiRouterConfigFn,
            useHash: true
        })
    ],
    declarations: [
        AppComponent,
        ArticleComponent,
        ArticleListComponent,
        AnonymousUserComponent,
        CategoryListComponent,
        Paginator,
        PreventOrphansPipe,
        SafePipe,
        TreeViewComponent,
        UnreadArticlesComponent,
    ],
    providers: [ArticleService, CategoryService],
    bootstrap: [AppComponent]
})

export class AppModule {}
