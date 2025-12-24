import { inject, Injectable, signal } from '@angular/core';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../environments/environment.prod';
import { Router } from '@angular/router';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

@Injectable({ providedIn: 'root' })
export class AuthService {
    user = signal<User | null>(null);
    loading = signal(true);
    router = inject(Router)

    constructor() {
        onAuthStateChanged(auth, user => {
            this.user.set(user);
            this.loading.set(false);
        });
    }

    login(email: string, password: string) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    logout() {
        return signOut(auth)
            .then((data: any) => {
                console.log(data);
                this.router.navigateByUrl('login');
            });
    }

    isLoggedIn() {
        return !!this.user();
    }
}
