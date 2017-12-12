declare var LIFERAY_VARS: any; // declare global LIFERAY_VARS

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Article } from '../models/article';
import { Category } from '../../category/models/category';

function dateFactory() {
    return new Date().toDateString();
}

@Injectable()
export class ArticleService {
    constructor(private http: Http) {}

    public getArticlesByCategory(category: Category): Promise<Response> {
        // http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/category/{categoryId}/v1

        let articleListUrl =
            `${LIFERAY_VARS.portalUrl}/o/kb-rest-api/article/${LIFERAY_VARS.groupId}/category/${category}/v1`;

        return this.http.get(articleListUrl)
            .map(function (res) {
                return res.json();
            }).toPromise();
    }

    getArticleById(articleId: number) {
        //http://{hostname}:{port}/o/kb-rest-api/article/{groupId}/content/{articleId}/user/{userId}/v1
        let articleUrl =
            `${LIFERAY_VARS.portalUrl}/o/kb-rest-api/article/${LIFERAY_VARS.groupId}/content/${articleId}/user/${LIFERAY_VARS.userId}/v1`;

        return this.http.get(articleUrl)
            .map(function (res) {
                return res.json();
            }).toPromise();
        /*return new Article(
                'Found Article With an Exceptionally Long Title Even for an Insurance Document',
                9999,
                '<p>Ab laborum exquisitaque ne irure proident te tempor dolor, consequat tempor offendit non iis anim vidisse reprehenderit nam ad cernantur a arbitror nam summis domesticarum deserunt eram senserit an culpa fabulas in illustriora aut non laborum o proident. Noster cernantur ubi dolore magna ab expetendis quem anim arbitror quem ad quamquam ab vidisse, nulla vidisse ut export fore. E sint concursionibus, nescius sunt de eiusmod imitarentur quo sed mandaremus nam quibusdam, minim concursionibus nescius aute officia ad an ita minim excepteur, ab summis nostrud, ab quae iudicem fidelissimae ne anim eiusmod ullamco. Sint possumus sed excepteur.In tamen consequat, se noster sempiternum ab mandaremus ex incurreret, irure ut id export incididunt non ab iis quis senserit ex est veniam occaecat, quo in nisi nulla illum se ut sunt eiusmod familiaritatem. Ubi ullamco comprehenderit, de id firmissimum qui voluptate ne veniam cupidatat ea export de do irure litteris se nulla probant aut mandaremus, non an aute officia, a fore mentitum non iis tempor aliquip. Non export ea labore o incurreret dolor probant.</p><p>Qui cernantur ad mentitum, fore a admodum. Incurreret est amet arbitror, ab se arbitrantur. Quorum laborum ne adipisicing o ad eiusmod hic proident, in anim quo quorum si ea vidisse cohaerescant.Nulla excepteur est commodo, o esse de fore. Incididunt summis singulis. Ubi malis incurreret efflorescere non se de comprehenderit sed iudicem sed vidisse, ab elit appellat, malis si ingeniis si in se sempiternum, possumus dolore doctrina, occaecat sunt aliquip. Si expetendis sempiternum.</p><p>De noster voluptate singulis ab quid transferrem fabulas labore fabulas. Export id nostrud non fugiat, nam quamquam nam voluptate e probant aliqua sunt ingeniis legam, sunt consequat quamquam aut fugiat quamquam o esse tamen, ab labore expetendis ab aute laboris praesentibus, iudicem reprehenderit do expetendis. Arbitror minim arbitror fabulas ea cernantur a dolore aut sed velit admodum despicationes, dolore ullamco ne consequat. Quem iudicem commodo.Mentitum et singulis, quamquam irure sint te cillum iis aliquip tamen veniam nescius export ab proident amet duis constias eram. Aut dolore non export. Quid te incurreret te laborum ipsum fabulas an quibusdam export commodo, ea quorum concursionibus, se non cohaerescant, aliqua expetendis te nisi ipsum, do summis quae id quamquam, arbitror ut tamen.</p><p>Si ut aliqua doctrina. Eram nam officia iis eram, quibusdam te cillum admodum ea hic sint expetendis ex culpa id constias id labore et legam do proident quo veniam ita appellat ea velit, export admodum non voluptatibus, elit possumus probant. Et magna ullamco ubi ut ipsum officia, ubi eram ab eram et offendit ut constias. Se quorum labore noster occaecat, et quem duis e officia.Eu esse amet in proident de e cillum occaecat. Mandaremus aliqua admodum fabulas, dolor ut qui aliqua mandaremus, sint proident nam consequat si eu si summis eram irure. Ne tamen offendit relinqueret ab ex sunt labore ad mandaremus ex pariatur tamen mentitum probant ex legam an excepteur si duis.</p><p>Quid comprehenderit consequat minim incididunt ne quis constias ita fabulas ne an quibusdam eruditionem ne quorum ut ingeniis ut aute. Eram despicationes mandaremus tamen singulis. Et doctrina te mandaremus sed quibusdam est minim.Incurreret concursionibus de eiusmod a a te tempor incurreret, quamquam nam quis nescius aut ea quo labore cillum tamen, nulla non quo quorum laboris o ne sint an duis iis noster mentitum te noster dolore, quo irure non quis. Ex et quae eiusmod. Offendit fidelissimae do admodum e aute eiusmod domesticarum a minim familiaritatem possumus multos mentitum, incurreret quo fore mandaremus, iudicem dolore duis probant malis, id quorum cernantur ullamco, et e arbitrantur id qui an veniam offendit. Cillum ne offendit qui elit, consequat relinqueret iis cupidatat, voluptate anim dolore pariatur malis, quae possumus ubi cupidatat, malis ab appellat ad aute te de deserunt aut consequat, dolor se mentitum e duis ne incurreret enim pariatur ingeniis.</p>',
                dateFactory()
            );*/
    }
}
