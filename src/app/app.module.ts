import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";
import { ArticleListComponent } from "./article/components/article-list.component";
import { CategoryListComponent } from "./category/components/category-list.component";
import { TreeViewComponent } from "./category/components/tree-view.component";
import { CategoryService } from './category/services/category-service';
import { ArticleService } from './article/services/article-service';

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UIRouterModule } from "@uirouter/angular";
import { uiRouterConfigFn } from "./app.routerconfig";

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
    ]
};

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        UIRouterModule.forRoot({
            states: [ categoriesState ],
            config: uiRouterConfigFn,
            useHash: true })
    ],
    declarations: [
        AppComponent,
        ArticleListComponent,
        CategoryListComponent,
        TreeViewComponent,
    ],
    providers: [CategoryService],
    bootstrap: [AppComponent]
})
export class AppModule {}
