import { Component, Input } from '@angular/core';
import { UIRouter } from '@uirouter/angular';


@Component({
    providers: [],
    selector: 'no-articles',
    templateUrl: './no-articles.html'
})
export class NoArticlesComponent {
    @Input() icon: string;
    @Input() message: string;
}
