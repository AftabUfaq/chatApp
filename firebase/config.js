import { initializeApp } from "firebase/app";
import { collection, initializeFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAf6DdvoJ-CdGGQ5luOThNyeN7arUJtasE",
//   authDomain: "chatchat-e4fe2.firebaseapp.com",
//   projectId: "chatchat-e4fe2",
//   storageBucket: "chatchat-e4fe2.appspot.com",
//   messagingSenderId: "147736568994",
//   appId: "1:147736568994:web:d9ab0526c38f740777e3fb",
// };∏

const firebaseConfig = {
  apiKey: "AIzaSyC27UFELuOsLqZO2ULoc4p8ir_MfOp-4sQ",
  authDomain: "lunchapp11.firebaseapp.com",
  databaseURL: "https://lunchapp11-default-rtdb.firebaseio.com",
  projectId: "lunchapp11",
  storageBucket: "lunchapp11.appspot.com",
  messagingSenderId: "457519122897",
  appId: "1:457519122897:web:0feaac75deb404f68cf8f0",
  measurementId: "G-MNHDTC1S1J",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const UserRef = collection(db, "Users");
