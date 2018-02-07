import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { get } from 'lodash';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { TranslationConfigModule } from '../app/shared/modules/translation.config.module';

@Injectable()
export class AppConfig {
    private configurations: any = new Object();
    private configPath = '/o/bcbsal.csd.knowledgeBase/json-config/';
    private resourcesPath = '/o/bcbsal.csd.knowledgeBase/resources/';

    constructor(private http: Http) { }

    // Get an Environment Entry by Key
    public getEnvByKey(key: any): any {
        return this.configurations.env[key];
    }

    // Get a Configuration Entry by Key
    public getEntryByKey(key: any): any {
        return this.configurations.config[key];
    }

    // Get a Resource Entry by Key
    public getResourceByKey(key: any): any {
        return get(this.configurations.resource, key);
    }

    // Should be self-explanatory
    public load(translate: TranslationConfigModule) {
        return new Promise((resolve, reject) => {
            // Given env.json
            this.loadFile(this.configPath + 'env.json').then((envData: any) => {
                this.configurations.env = envData;
                // Load production or development configuration file based on before
                this.loadFile(this.configPath + envData.env + '.json').then((conf: any) => {
                    this.configurations.config = conf;
                    // Load resources files based on browser language
                    this.loadFile(this.resourcesPath + translate.getBrowserLang() + '.json').then((resource: any) => {
                        this.configurations.resource = resource;
                        return resolve(true);
                    });
                });
            });
        });
    }

    private loadFile(path: string) {
        return new Promise((resolve, reject) => {
            this.http.get(path)
                .map((res) => res.json())
                .catch((error: any) => {
                    // console.error(error);
                    // TODO: Handle error
                    return Observable.throw(error.json().error || 'Server error');
                })
                .subscribe((resData) => {
                    return resolve(resData);
                });
        });
    }

}
