import { Component, OnInit } from '@angular/core';
import { UIRouter } from '@uirouter/angular';

@Component({
    selector: 'kb-app',
    styleUrls: ['./app.css'],
    templateUrl: './app.html',
})
export class AppComponent implements OnInit {
    constructor(private uiRouter: UIRouter) {}

    ngOnInit() {
        this.uiRouter.transitionService.onError({}, (transition) => {
            this.uiRouter.stateService.go('error', { error: transition.error().detail }, { location: true });
        });
    }
}
