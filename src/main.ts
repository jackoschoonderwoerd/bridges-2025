import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './environments/environment.prod';

bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
