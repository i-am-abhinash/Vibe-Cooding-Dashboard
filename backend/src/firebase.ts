import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';

const serviceAccountPath = path.resolve('D:/Mitra/club-attendance-app/mitra-attandance-firebase-adminsdk-fbsvc-8123d6dce1.json');
const serviceAccount = require(serviceAccountPath);

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://mitra-attandance.firebaseio.com'
});

export const db = getFirestore(app);
export const auth = getAuth(app);
