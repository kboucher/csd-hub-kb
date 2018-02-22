declare var Liferay: any;

import { Injectable, Injector } from '@angular/core';
import { StateDeclaration, UIRouter } from '@uirouter/angular';

export function uiRouterConfigFn(uiRouter: UIRouter, injector: Injector) {
    uiRouter.urlRouter.deferIntercept();

    // If no URL matches, and we don't already have a current state,
    // then go to the `tasks` state by default. This function is
    // intended to handle the case where a saved bookmark targets some
    // other portlet on the page with a hashed URL, as well as the
    // default state ('')
    //
    // In that initial loading case, we want this portlet to go to its home state
    // but in subsequent cases where this portlet has moved to an active state we
    // want it to stay where it is in terms of state upon receipt of an unknown url.
    uiRouter.urlService.rules.otherwise((router, url) => {
        const currentState = uiRouter.stateService.current.name;
        const fragment = window.location.hash;
        let defaultState;

        if (!Liferay.ThemeDisplay.isSignedIn()) {
            defaultState = 'anonymous-user';
        } else if (fragment) {
            defaultState = fragment.replace('#', '');
        } else {
            defaultState = 'categories';
        }

        if (!currentState) {
            uiRouter.stateService.go(defaultState, null, { location: true });
        }

        return;
    });

}
