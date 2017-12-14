import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";
import { AnonymousUserComponent } from "./authentication/anonymous-user.component";
import { ArticleListComponent } from "./article/components/article-list.component";
import { CategoryListComponent } from "./category/components/category-list.component";
import { TreeViewComponent } from "./category/components/tree-view.component";
import { CategoryService } from './category/services/category-service';
import { ArticleService } from './article/services/article-service';
import { PreventOrphansPipe } from './pipes/prevent-orphans.pipe';
import { SafePipe } from './pipes/safe.pipe';

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UIRouterModule, Transition } from "@uirouter/angular";
import { uiRouterConfigFn } from "./app.routerconfig";

let anonymousUserState = {
    name: 'anonymous-user',
    url: '/anonymous-user',
    component: AnonymousUserComponent,
    views: {
        "!$default": { component: AnonymousUserComponent }
    }
};

let categoriesState = {
    name: 'categories',
    url: '/categories',
    component: CategoryListComponent,
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
    url: '/:id/articles',
    component: ArticleListComponent,
    params: {
        selectedCategory: null,
    },
    resolve: [
        {
            token: 'articles',
            deps: [Transition, ArticleService],
            resolveFn: (trans, articleService) => articleService.getArticlesByCategory(trans.params().id)
        }, {
            token: 'categories',
            deps: ['categories'],
            resolveFn: (categories) => { return categories; }
        }, {
            token: 'selectedCategory',
            deps: [Transition],
            resolveFn: (trans) => { return trans.params().selectedCategory; }
        }
    ],
    views: {
        "!$default": { component: ArticleListComponent }
    }
};

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        UIRouterModule.forRoot({
            states: [
                articlesState,
                anonymousUserState,
                categoriesState
            ],
            config: uiRouterConfigFn,
            useHash: true
        })
    ],
    declarations: [
        AppComponent,
        ArticleListComponent,
        AnonymousUserComponent,
        CategoryListComponent,
        PreventOrphansPipe,
        SafePipe,
        TreeViewComponent,
    ],
    providers: [ArticleService, CategoryService],
    bootstrap: [AppComponent]
})
export class AppModule {}
