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

    /*
        AOT requires this property (somehow related to SafePipe).

        Removing the `safe:html` call from the template precludes the
        need for this property. (Though, we do not see this issue in
        the ArticleComponent/template.)
    */
    html: string;
}
