// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get, set, child } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SEND_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

export async function UserRegister(username, password, email, name) {
  if (!username || !password || !email || !name) {
    return {
      success: false,
      message: "Missing informations",
    };
  }
  const dbRef = ref(getDatabase());
  var user = await get(child(dbRef, `users/${username}`));
  
  if (user.exists()) {
    return {
      success: false,
      message: "User with username " + username + " already exists",
    };
  } else {
    set(ref(db, "users"), {
      [username]: {
        password: password,
        email: email,
        name: name,
      },
    });
    return {
      success: true,
      message: "Welcome! " + name,
    };
  }
}

export function UserLogin(email, password) {}
