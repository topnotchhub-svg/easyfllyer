
import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDkTByojrnDP0zNFV5mVPkdBY0KhgTNGwM',
  authDomain: 'easyfllyer.firebaseapp.com',
  projectId: 'easyfllyer',
  storageBucket: 'easyfllyer.firebasestorage.app',
  messagingSenderId: '63894906325',
  appId: '1:63894906325:web:6279a8851f777863cf895c',
};

// ✅ Check if app is already initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// ✅ Check if auth is already initialized

let auth;
try {
  // Try to get existing auth instance
  auth = getAuth(app);
} catch (e) {
  // If not initialized, initialize with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };