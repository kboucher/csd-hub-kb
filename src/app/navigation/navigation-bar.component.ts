import { Component, Input } from '@angular/core';

@Component({
    selector: 'navigation-bar',
    templateUrl: './navigation-bar.html'
})
export class NavigationBarComponent {
    @Input() pageSize: number;
    @Input() unreadCount: number;

    constructor() {}
}
