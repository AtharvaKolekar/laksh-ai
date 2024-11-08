import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBCbMMia_y6oTLaXMDSArzloc-4-pzbdG8",
    authDomain: "wonderai-dc369.firebaseapp.com",
    databaseURL: "https://wonderai-dc369-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wonderai-dc369",
    storageBucket: "wonderai-dc369.appspot.com",
    messagingSenderId: "179383726870",
    appId: "1:179383726870:web:0b5e09d8ba628b6768d637"
  };

const app = initializeApp(firebaseConfig);
export default app;
export const initFirebase = () => {
  return app;
};
export const database = getDatabase(app)

export const auth = getAuth();