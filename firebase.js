import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBFGtrA0QlRZ_IhjKddZhW0eZW6i5Gh7tE",
    authDomain: "whatsapp-2-7378c.firebaseapp.com",
    projectId: "whatsapp-2-7378c",
    storageBucket: "whatsapp-2-7378c.appspot.com",
    messagingSenderId: "627302313552",
    appId: "1:627302313552:web:1b09480a29005030a6eb55"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
//   const storage = getStorage(app);
  
  export  { app, db, auth, provider };