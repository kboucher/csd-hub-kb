import { Component, Input } from '@angular/core';

@Component({
    selector: 'system-notification',
    styleUrls: ['./system-notification.css'],
    templateUrl: './system-notification.html',
})
export class SystemNotificationComponent {
    @Input() icon: string;
    @Input() message: string;
    @Input() notificationClass: string;
}
