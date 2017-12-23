import { Component, Input } from '@angular/core';

@Component({
    selector: 'navigation-bar',
    styleUrls: ['./navigation-bar.css'],
    templateUrl: './navigation-bar.html',
})
export class NavigationBarComponent {
    @Input() pageSize: number;
    @Input() unreadCount: number;
}
