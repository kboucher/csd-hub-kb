import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { Transition, UIRouter, UIRouterModule } from '@uirouter/angular';
import { uiRouterConfigFn } from './app.routerconfig';
import { CoreModule } from './core.module';

// Components
import { AppConfig } from '../config/app.config';
import { TranslationConfigModule } from './shared/modules/translation.config.module';

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

export function deselectCategories(categoryService, categories) {
    return categoryService.deselectCategories(categories);
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
    resolve: [
        {
            deps: [Transition],
            // TODO: Why aren't ˋparamsˋ accessible via ˋtrans.params()ˋ?
            resolveFn: resolveErrorParams,
            token: 'error',
        },
    ],
    url: '/error',
    views: {
        '!$default': { component: ErrorComponent },
    },
};

const categoriesState = {
    name: 'categories',
    resolve: [
        {
            deps: [CategoryService],
            resolveFn: resolveCategoriesService,
            token: 'categories',
        },
    ],
    url: '',
    views: {
        '^.categories': { component: CategoryListComponent },
    },
};

const categoryState = {
    name: 'categories.category',
    resolve: [
        {
            deps: ['categories'],
            resolveFn: resolveCategories,
            token: 'categories',
        }, {
            deps: [Transition, CategoryService, 'categories'],
            resolveFn: resolveSelectedCategoryService,
            token: 'selectedCategory',
        },
    ],
    url: '/category',
    views: {
        '^.^.categories': { component: TreeViewComponent },
    },
};

const articlesState = {
    name: 'categories.category.articles',
    params: {
        size: null,
        sortCriterion: null,
        sortOrder: null,
    },
    resolve: [
        {
            deps: [Transition, ArticleService],
            resolveFn: resolveArticles,
            token: 'articlesResponse',
        }, {
            deps: [Transition],
            resolveFn: resolveArticleId,
            token: 'articleId',
        }, {
            deps: [Transition],
            resolveFn: resolvePageNum,
            token: 'pageNum',
        }, {
            deps: [Transition, CategoryService, 'categories'],
            resolveFn: resolveSelectedCategoryService,
            token: 'selectedCategory',
        },
    ],
    url: '/:categoryId/page/:page',
    views: {
        '^.articles': { component: ArticleListComponent },
    },
};

const unreadArticlesState = {
    name: 'categories.category.unread',
    params: {
        size: null,
        sortCriterion: null,
        sortOrder: null,
    },
    resolve: [
        {
            deps: [Transition, ArticleService],
            resolveFn: resolveUnreadArticles,
            token: 'articlesResponse',
        }, {
            deps: [Transition],
            resolveFn: resolveArticleId,
            token: 'articleId',
        }, {
            deps: [Transition],
            resolveFn: resolvePageNum,
            token: 'pageNum',
        }, {
            deps: [CategoryService, 'categories'],
            resolveFn: deselectCategories,
            token: 'selectedCategory',
        },
    ],
    url: '/unread/page/:page',
    views: {
        '^.articles': { component: ArticleListComponent },
    },
};

const articleState = {
    name: 'categories.category.articles.article',
    resolve: [
        {
            deps: [Transition, ArticleService],
            resolveFn: resolveArticle,
            token: 'article',
        }, {
            deps: ['selectedCategory'],
            resolveFn: resolveSelectedCategory,
            token: 'category',
        }, {
            deps: [Transition],
            resolveFn: resolvePageNum,
            token: 'pageNum',
        },
    ],
    url: '/article/:articleId',
    views: {
        '^.^.article': { component: ArticleComponent },
    },
};

const unreadArticleState = {
    name: 'categories.category.unread.article',
    resolve: [
        {
            deps: [Transition, ArticleService],
            resolveFn: resolveArticle,
            token: 'article',
        },
    ],
    url: '/:articleId',
    views: {
        '^.^.article': { component: ArticleComponent },
    },
};

export function initResources(config: AppConfig, translate: TranslationConfigModule, uiRouter: UIRouter) {
    const router = uiRouter;

    /* tslint:disable only-arrow-functions */
    return function() {
        config.load(translate).then(function() {
            /*
                Recover from `deferIntercept: true` in UIRouterModule
                import below. (Allows Ng APP_INITIALIZER to finish before
                routing begins.)
             */
            router.urlRouter.listen();
            router.urlRouter.sync();
        });
    };
    /* tslint:enable */
}

@NgModule({
    bootstrap: [AppComponent],
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
    imports: [
        BrowserModule,
        CoreModule,
        FormsModule,
        HttpModule,
        TranslationConfigModule,
        UIRouterModule.forRoot({
            config: uiRouterConfigFn,
            states: [
                anonymousUserState,
                articleState,
                articlesState,
                categoriesState,
                categoryState,
                errorState,
                unreadArticleState,
                unreadArticlesState,
            ],
            useHash: true,
        }),
    ],
    providers: [
        AppConfig, {
            deps: [AppConfig, TranslationConfigModule, UIRouter],
            multi: true,
            provide: APP_INITIALIZER,
            useFactory: initResources,
        },
    ],
})

export class AppModule {}
