import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { adminGuard } from './admin/admin.guard';

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
        path: 'add-bridge/:id',
        loadComponent: () => import('./admin/add-bridge/add-bridge')
            .then(c => c.AddBridge)
    },
    {
        path: 'map',
        loadComponent: () => import('./map/map/map')
            .then(c => c.MapComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login.component/login.component')
            .then(c => c.LoginComponent)
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./admin/admin.component/admin.component')
            .then(c => c.AdminComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./pages/home/home')
            .then(c => c.HomeComponent)
    }
];
