import { Component, Input, OnInit } from '@angular/core';
import { UIRouter } from '@uirouter/angular';

const messageSuffix = ' Please contact the system administrator.';

@Component({
    selector: 'kb-error',
    templateUrl: './error.html',
})
export class ErrorComponent implements OnInit {
    @Input() error: any;

    public message: string = 'Unknown error has occurred.' + messageSuffix;

    constructor(private uiRouter: UIRouter) {}

    ngOnInit() {
        if (this.error) {
            this.message = `API Error: ${this.error.status}. ${this.error.statusText}. ${messageSuffix}`;
        }
    }
}
