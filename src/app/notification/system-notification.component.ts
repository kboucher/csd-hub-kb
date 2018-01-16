import { Component, Input } from '@angular/core';

@Component({
    selector: 'kb-system-notification',
    styleUrls: ['./system-notification.scss'],
    templateUrl: './system-notification.html',
})
export class SystemNotificationComponent {
    @Input() icon: string;
    @Input() message: string;
    @Input() notificationClass: string;
}
