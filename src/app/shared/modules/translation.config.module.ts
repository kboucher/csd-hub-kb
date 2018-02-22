import { ModuleWithProviders, NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { isNull, isUndefined } from 'lodash';

export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, '/o/bcbsal.csd.knowledgeBase/i18n/', '.json');
}

const translationOptions = {
    loader: {
        deps: [Http],
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
    },
};

@NgModule({
    exports: [TranslateModule],
    imports: [TranslateModule.forRoot(translationOptions)],
})
export class TranslationConfigModule {
    browserLang;

    /*
        @param translate {TranslateService}
     */
    constructor(private translate: TranslateService) {
        // Setting up Translations
        translate.addLangs(['en']);
        translate.setDefaultLang('en');
        this.browserLang = translate.getBrowserLang();
        translate.use(this.browserLang.match(/en/) ? this.browserLang : 'en');
    }

    public getBrowserLang() {
        if (isUndefined(this.browserLang) || isNull(this.browserLang)) {
            this.browserLang = 'en';
        }

        return this.browserLang;
    }
}
