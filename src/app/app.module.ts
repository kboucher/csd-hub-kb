import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { Transition, UIRouterModule } from '@uirouter/angular';
import { uiRouterConfigFn } from './app.routerconfig';

// Components
import { AppService } from './app-service';
import { AppComponent } from './app.component';
import { ArticleListComponent } from './article/components/article-list.component';
import { ArticleComponent } from './article/components/article.component';
import { AnonymousUserComponent } from './authentication/anonymous-user.component';
import { CategoryListComponent } from './category/components/category-list.component';
import { TreeViewComponent } from './category/components/tree-view.component';
import { ErrorComponent } from './error/error.component';
import { NavigationBarComponent } from './navigation/navigation-bar.component';
import { SystemNotificationComponent } from './notification/system-notification.component';
import { PaginatorComponent } from './paginator/paginator.component';

// Services
import { ArticleService } from './article/services/article-service';
import { CategoryService } from './category/services/category-service';

// Pipes/utilities
import { PreventOrphansPipe } from './pipes/prevent-orphans.pipe';
import { SafePipe } from './pipes/safe.pipe';

const anonymousUserState = {
    name: 'anonymous-user',
    url: '/anonymous-user',
    views: {
        '!$default': { component: AnonymousUserComponent },
    },
};

const errorState = {
    name: 'error',
    url: '/error',
    resolve: [
        {
            token: 'error',
            deps: [Transition],
            // TODO: Why aren't ˋparamsˋ accessible via ˋtrans.params()ˋ?
            resolveFn: (trans) => trans.targetState()._params.error,
        },
    ],
    views: {
        '!$default': { component: ErrorComponent },
    },
};

const categoriesState = {
    name: 'categories',
    url: '/categories',
    resolve: [
        {
            token: 'categories',
            deps: [CategoryService],
            resolveFn: (categoryService) => categoryService.getCategories(),
        },
    ],
    views: {
        '!$default': { component: CategoryListComponent },
    },
};

const articlesState = {
    name: 'categories.articles',
    url: '/:categoryId/articles/page/:page/size/:size/sort/:sortCriterion/:sortOrder',
    resolve: [
        {
            token: 'articlesResponse',
            deps: [Transition, ArticleService],
            resolveFn: (trans, articleService) => {
                return articleService.getArticlesByCategory(trans.params().categoryId, {
                    page: trans.params().page,
                    size: trans.params().size,
                    sortCriterion: trans.params().sortCriterion,
                    sortOrder: trans.params().sortOrder,
                });
            },
        }, {
            token: 'articleId',
            deps: [Transition],
            resolveFn: (trans) => trans.params().articleId,
        }, {
            token: 'categories',
            deps: ['categories'],
            resolveFn: (categories) => categories,
        }, {
            token: 'pageNum',
            deps: [Transition],
            resolveFn: (trans) => trans.params().page,
        }, {
            token: 'pageSize',
            deps: [Transition],
            resolveFn: (trans) => trans.params().size,
        }, {
            token: 'sortCriterion',
            deps: [Transition],
            resolveFn: (trans) => trans.params().sortCriterion,
        }, {
            token: 'sortOrder',
            deps: [Transition],
            resolveFn: (trans) => trans.params().sortOrder,
        }, {
            token: 'selectedCategory',
            deps: [Transition, CategoryService, 'categories'],
            resolveFn: (trans, categoryService, categories) =>
                    categoryService.findById(categories, trans.params().categoryId),
        },
    ],
    views: {
        '!$default': { component: ArticleListComponent },
    },
};

const unreadArticlesState = {
    name: 'categories.unread',
    url: '/unread/page/:page/size/:size/sort/:sortCriterion/:sortOrder',
    resolve: [
        {
            token: 'articlesResponse',
            deps: [Transition, ArticleService],
            resolveFn: (trans, articleService) => articleService.getUnreadArticles({
                page: trans.params().page,
                size: trans.params().size,
                sortCriterion: trans.params().sortCriterion,
                sortOrder: trans.params().sortOrder,
            }),
        }, {
            token: 'articleId',
            deps: [Transition],
            resolveFn: (trans) => trans.params().articleId,
        }, {
            token: 'categories',
            deps: ['categories'],
            resolveFn: (categories) => categories,
        }, {
            token: 'pageNum',
            deps: [Transition],
            resolveFn: (trans) => trans.params().page,
        }, {
            token: 'pageSize',
            deps: [Transition],
            resolveFn: (trans) => trans.params().size,
        }, {
            token: 'sortCriterion',
            deps: [Transition],
            resolveFn: (trans) => trans.params().sortCriterion,
        }, {
            token: 'sortOrder',
            deps: [Transition],
            resolveFn: (trans) => trans.params().sortOrder,
        },
    ],
    views: {
        '!$default': { component: ArticleListComponent },
    },
};

const articleState = {
    name: 'categories.articles.article',
    url: '/:articleId',
    resolve: [
        {
            token: 'article',
            deps: [Transition, ArticleService],
            resolveFn: (trans, articleService) => articleService.getArticleById(trans.params().articleId, {
                page: trans.params().page,
                size: trans.params().size,
            }),
        }, {
            token: 'category',
            deps: ['selectedCategory'],
            resolveFn: (selectedCategory) => selectedCategory,
        },
    ],
    views: {
        '^.article': { component: ArticleComponent },
    },
};

const unreadArticleState = {
    name: 'categories.unread.article',
    url: '/unread/:articleId',
    resolve: [
        {
            token: 'article',
            deps: [Transition, ArticleService],
            resolveFn: (trans, articleService) => articleService.getArticleById(trans.params().articleId),
        },
    ],
    views: {
        '^.article': { component: ArticleComponent },
    },
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
                errorState,
                unreadArticleState,
                unreadArticlesState,
            ],
            config: uiRouterConfigFn,
            useHash: true,
        }),
    ],
    declarations: [
        AppComponent,
        AnonymousUserComponent,
        ArticleComponent,
        ArticleListComponent,
        CategoryListComponent,
        ErrorComponent,
        NavigationBarComponent,
        PaginatorComponent,
        PreventOrphansPipe,
        SafePipe,
        SystemNotificationComponent,
        TreeViewComponent,
    ],
    providers: [AppService, ArticleService, CategoryService],
    bootstrap: [AppComponent],
})

export class AppModule {}
