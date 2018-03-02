declare var Liferay: any;
declare var AUI: any;

import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
    public extendSession(): void {
        if (AUI && typeof AUI === 'function') {
            AUI().use('liferay-session', () => {
                if (Liferay.Session) {
                    Liferay.Session.extend();
                }
            });
        }
    }
}
