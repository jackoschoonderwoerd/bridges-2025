import { Injectable } from '@angular/core';

export interface NavigationItem {
    appearanceNl: string;
    appearanceEn: string;
    link: string
}

@Injectable({
    providedIn: 'root',
})
export class NavigationService {

    userNavigationItems: NavigationItem[] = [

        // {
        //     appearanceEn: 'login',
        //     appearanceNl: 'login',
        //     link: 'login'
        // },
        {
            appearanceEn: 'map',
            appearanceNl: 'map',
            link: 'map'
        },
        {
            appearanceEn: 'home',
            appearanceNl: 'home',
            link: 'home'
        }
    ];
    adminNavigationItems: NavigationItem[] = [
        {
            appearanceEn: 'admin',
            appearanceNl: 'admin',
            link: 'admin'
        },

    ]

    getUserNavigationItems() {
        return this.userNavigationItems
    }
    getAdminNavigationItems() {
        return this.adminNavigationItems
    }
}
