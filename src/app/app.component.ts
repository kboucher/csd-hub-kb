import { Component, OnInit } from '@angular/core';
import { UIRouter } from '@uirouter/angular';

@Component({
    selector: 'app',
    templateUrl: './app.html'
})
export class AppComponent implements OnInit {
    constructor(private _uiRouter: UIRouter) {}

    ngOnInit() {
        console.log("Angular application component has been started ...");
    }
}
