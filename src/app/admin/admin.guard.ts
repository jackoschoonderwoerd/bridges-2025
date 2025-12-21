import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
// import { AuthService } from '../auth/auth.service';


export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthStore);
    const router = inject(Router);

    if (auth.loading()) {
        return false;
    }

    if (!auth.isLoggedIn()) {
        router.navigate(['/admin/login']);
        return false;
    }

    return true;
};
