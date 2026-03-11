// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// My Credentials
// const firebaseConfig = {
//   apiKey: 'AIzaSyCrP5kjUBR9VDrOYBKNhOBRe70pzyYyjO0',
//   authDomain: 'jspromotionalapp.firebaseapp.com',
//   projectId: 'jspromotionalapp',
//   storageBucket: 'jspromotionalapp.firebasestorage.app',
//   messagingSenderId: '383720093577',
//   appId: '1:383720093577:web:fc8dbb1ab3ba43edd8d358',
//   measurementId: 'G-L6NNW5L86C',
// };

// Client Credentials
const firebaseConfig = {
  apiKey: 'AIzaSyDkTByojrnDP0zNFV5mVPkdBY0KhgTNGwM',
  authDomain: 'easyfllyer.firebaseapp.com',
  projectId: 'easyfllyer',
  storageBucket: 'easyfllyer.firebasestorage.app',
  messagingSenderId: '63894906325',
  appId: '1:63894906325:web:6279a8851f777863cf895c',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// New Step

export {auth, app, db};
