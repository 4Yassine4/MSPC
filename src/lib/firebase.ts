import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined
let storage: FirebaseStorage | undefined

if (typeof window !== 'undefined') {
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.warn('⚠️ Configuration Firebase manquante. Vérifiez votre fichier .env.local')
  } else {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }
    if (app) {
      auth = getAuth(app)
      db = getFirestore(app)
      storage = getStorage(app)
    }
  }
}

if (typeof window !== 'undefined' && !auth) {
  try {
    auth = getAuth()
  } catch (e) {
    console.warn('Firebase Auth not initialized')
  }
}

if (typeof window !== 'undefined' && !db) {
  try {
    db = getFirestore()
  } catch (e) {
    console.warn('Firestore not initialized')
  }
}

if (typeof window !== 'undefined' && !storage) {
  try {
    storage = getStorage()
  } catch (e) {
    console.warn('Firebase Storage not initialized')
  }
}

export { auth, db, storage }
export default app

