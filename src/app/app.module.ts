import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { Transition, UIRouter, UIRouterModule } from '@uirouter/angular';
import { uiRouterConfigFn } from './app.routerconfig';

// Components
import { AppConfig } from '../config/app.config';
import { TranslationConfigModule } from './shared/modules/translation.config.module';

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

export function resolveErrorParams(transition) {
    return transition.targetState()._params.error;
}

export function resolveCategoriesService(categoryService) {
    return categoryService.getCategories();
}

export function resolveArticles(transition, articleService) {
    return articleService.getArticlesByCategory(transition.params().categoryId, {
        page: transition.params().page,
        size: transition.params().size,
        sortCriterion: transition.params().sortCriterion,
        sortOrder: transition.params().sortOrder,
    });
}

export function resolveUnreadArticles(transition, articleService) {
    return articleService.getUnreadArticles({
        page: transition.params().page,
        size: transition.params().size,
        sortCriterion: transition.params().sortCriterion,
        sortOrder: transition.params().sortOrder,
    });
}

export function resolveArticle(transition, articleService) {
    return articleService.getArticleById(transition.params().articleId, {
        page: transition.params().page,
        size: transition.params().size,
    });
}

export function resolveArticleId(transition) {
    return transition.params().articleId;
}

export function resolveCategories(categories) {
    return categories;
}

export function resolvePageNum(transition) {
    return transition.params().page;
}

export function resolvePageSize(transition) {
    return transition.params().size;
}

export function resolveSortCriterion(transition) {
    return transition.params().sortCriterion;
}

export function resolveSortOrder(transition) {
    return transition.params().sortOrder;
}

export function resolveSelectedCategoryService(transition, categoryService, categories) {
    return categoryService.findById(categories, transition.params().categoryId);
}

export function resolveSelectedCategory(selectedCategory) {
    return selectedCategory;
}

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
            resolveFn: resolveErrorParams,
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
            resolveFn: resolveCategoriesService,
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
            resolveFn: resolveArticles,
        }, {
            token: 'articleId',
            deps: [Transition],
            resolveFn: resolveArticleId,
        }, {
            token: 'categories',
            deps: ['categories'],
            resolveFn: resolveCategories,
        }, {
            token: 'pageNum',
            deps: [Transition],
            resolveFn: resolvePageNum,
        }, {
            token: 'pageSize',
            deps: [Transition],
            resolveFn: resolvePageSize,
        }, {
            token: 'sortCriterion',
            deps: [Transition],
            resolveFn: resolveSortCriterion,
        }, {
            token: 'sortOrder',
            deps: [Transition],
            resolveFn: resolveSortOrder,
        }, {
            token: 'selectedCategory',
            deps: [Transition, CategoryService, 'categories'],
            resolveFn: resolveSelectedCategoryService,
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
            resolveFn: resolveUnreadArticles,
        }, {
            token: 'articleId',
            deps: [Transition],
            resolveFn: resolveArticleId,
        }, {
            token: 'categories',
            deps: ['categories'],
            resolveFn: resolveCategories,
        }, {
            token: 'pageNum',
            deps: [Transition],
            resolveFn: resolvePageNum,
        }, {
            token: 'pageSize',
            deps: [Transition],
            resolveFn: resolvePageSize,
        }, {
            token: 'sortCriterion',
            deps: [Transition],
            resolveFn: resolveSortCriterion,
        }, {
            token: 'sortOrder',
            deps: [Transition],
            resolveFn: resolveSortOrder,
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
            resolveFn: resolveArticle,
        }, {
            token: 'category',
            deps: ['selectedCategory'],
            resolveFn: resolveSelectedCategory,
        }, {
            token: 'pageSize',
            deps: [Transition],
            resolveFn: resolvePageSize,
        }, {
            token: 'sortCriterion',
            deps: [Transition],
            resolveFn: resolveSortCriterion,
        }, {
            token: 'sortOrder',
            deps: [Transition],
            resolveFn: resolveSortOrder,
        },
    ],
    views: {
        '^.article': { component: ArticleComponent },
    },
};

const unreadArticleState = {
    name: 'categories.unread.article',
    url: '/:articleId',
    resolve: [
        {
            token: 'article',
            deps: [Transition, ArticleService],
            resolveFn: resolveArticle,
        }, {
            token: 'pageSize',
            deps: [Transition],
            resolveFn: resolvePageSize,
        }, {
            token: 'sortCriterion',
            deps: [Transition],
            resolveFn: resolveSortCriterion,
        }, {
            token: 'sortOrder',
            deps: [Transition],
            resolveFn: resolveSortOrder,
        },
    ],
    views: {
        '^.article': { component: ArticleComponent },
    },
};

export function initResources(config: AppConfig, translate: TranslationConfigModule, uiRouter: UIRouter) {
    const router = uiRouter;

    return () => config.load(translate).then(() => {
        /*
            Recover from `deferIntercept: true` in UIRouterModule
            import below. (Allows Ng APP_INITIALIZER to finish before
            routing begins.)
         */
        router.urlRouter.listen();
        router.urlRouter.sync();
    });
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        TranslationConfigModule,
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
            deferIntercept: true, // Allows APP_INITIALIZER to complete before routing
            useHash: true,
        }),
    ],
    declarations: [
        AnonymousUserComponent,
        AppComponent,
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
    providers: [
        AppConfig, {
            provide: APP_INITIALIZER,
            useFactory: initResources,
            deps: [AppConfig, TranslationConfigModule, UIRouter],
            multi: true,
        },
        AppService,
        ArticleService,
        CategoryService,
    ],
    bootstrap: [AppComponent],
})

export class AppModule {}
