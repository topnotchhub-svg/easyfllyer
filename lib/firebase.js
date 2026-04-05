import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDkTByojrnDP0zNFV5mVPkdBY0KhgTNGwM',
  authDomain: 'easyfllyer.firebaseapp.com',
  projectId: 'easyfllyer',
  storageBucket: 'easyfllyer.firebasestorage.app',
  messagingSenderId: '63894906325',
  appId: '1:63894906325:web:6279a8851f777863cf895c',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, app, db };
