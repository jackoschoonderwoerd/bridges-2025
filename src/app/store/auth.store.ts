import { Injectable, signal, computed } from '@angular/core';
import {
    User,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './../../environments/environment.prod';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

@Injectable({ providedIn: 'root' })
export class AuthStore {
    private readonly _user = signal<User | null>(null);
    private readonly _loading = signal(true);

    readonly user = this._user.asReadonly();
    readonly loading = this._loading.asReadonly();

    readonly isLoggedIn = computed(() => !!this._user());

    constructor() {
        onAuthStateChanged(auth, user => {
            this._user.set(user);
            this._loading.set(false);
        });
    }

    async login(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password);
    }

    async logout() {
        await signOut(auth);
    }
}
