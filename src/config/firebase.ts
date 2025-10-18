import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQwo6qEZWlOyXRv3iPycYiLIqRt3PalkE",
  authDomain: "foodflash-46a42.firebaseapp.com",
  projectId: "foodflash-46a42",
  storageBucket: "foodflash-46a42.firebasestorage.app",
  messagingSenderId: "497618057237",
  appId: "1:497618057237:web:3025f9c950cdf76b67361c"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Export app for other uses
export default app

