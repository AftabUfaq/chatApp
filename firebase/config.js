
import { initializeApp } from "firebase/app";
import { collection, initializeFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf6DdvoJ-CdGGQ5luOThNyeN7arUJtasE",
  authDomain: "chatchat-e4fe2.firebaseapp.com",
  projectId: "chatchat-e4fe2",
  storageBucket: "chatchat-e4fe2.appspot.com",
  messagingSenderId: "147736568994",
  appId: "1:147736568994:web:d9ab0526c38f740777e3fb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });

export  const UserRef = collection(db, "Users");
