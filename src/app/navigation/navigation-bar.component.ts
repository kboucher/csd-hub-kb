import { Component, Input } from '@angular/core';

@Component({
    selector: 'kb-navigation-bar',
    styleUrls: ['./navigation-bar.scss'],
    templateUrl: './navigation-bar.html',
})
export class NavigationBarComponent {
    @Input() pageSize: number;
    @Input() unreadCount: number;
}
