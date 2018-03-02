import { Component, OnInit } from '@angular/core';
import { UIRouter } from '@uirouter/core';
import { SessionService } from './session-service';

@Component({
    selector: 'kb-app',
    styleUrls: ['./app.scss'],
    templateUrl: './app.html',
})
export class AppComponent implements OnInit {
    constructor(
        private sessionService: SessionService,
        private uiRouter: UIRouter,
    ) {}

    ngOnInit() {
        this.uiRouter.transitionService.onSuccess({ to: '**' }, () => {
            this.sessionService.extendSession();
        });
    }
}
