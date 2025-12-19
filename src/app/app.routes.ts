import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'bridge/:slug',
        loadComponent: () => import('./pages/bridge-detail/bridge-detail')
            .then(c => c.BridgeDetail)
    },
    {
        path: '**',
        loadComponent: () => import('./pages/home/home')
            .then(c => c.HomeComponent)
    }
];
