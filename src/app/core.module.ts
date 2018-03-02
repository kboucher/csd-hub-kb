import { NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AppService } from './app-service';
import { ArticleService } from './article/services/article-service';
import { CategoryService } from './category/services/category-service';
import { SessionService } from './session-service';

@NgModule({
    providers: [
        AppService,
        ArticleService,
        CategoryService,
        SessionService,
        TranslateService,
    ],
})
export class CoreModule {
}
