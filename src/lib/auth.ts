import { auth } from './firebase'
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'

export interface AuthUser {
  id: string
  email: string
}

export async function signIn(email: string, password: string) {
  try {
    if (typeof window === 'undefined') {
      return { user: null, error: { message: 'Authentification disponible uniquement côté client' } }
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    return { 
      user: {
        id: user.uid,
        email: user.email || ''
      }, 
      error: null 
    }
  } catch (error: any) {
    console.error('Sign in error:', error)
    let errorMessage = 'Email ou mot de passe incorrect'
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'Aucun compte trouvé avec cet email'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Mot de passe incorrect'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email invalide'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Erreur de connexion réseau. Vérifiez votre connexion internet.'
    } else if (error.message) {
      errorMessage = error.message
    }

    return { 
      user: null, 
      error: { message: errorMessage } 
    }
  }
}

export async function signOut() {
  try {
    if (typeof window === 'undefined') {
      return { error: null }
    }

    await firebaseSignOut(auth)
    return { error: null }
  } catch (error: any) {
    console.error('Sign out error:', error)
    return { error: { message: error.message || 'Erreur lors de la déconnexion' } }
  }
}

export async function getCurrentUser() {
  try {
    if (typeof window === 'undefined') {
      return { user: null, error: null }
    }

    const currentUser = auth.currentUser
    
    if (!currentUser) {
      return { user: null, error: null }
    }

    return { 
      user: {
        id: currentUser.uid,
        email: currentUser.email || ''
      }, 
      error: null 
    }
  } catch (error: any) {
    return { user: null, error }
  }
}

export async function getSession() {
  try {
    if (typeof window === 'undefined') {
      return { session: null, error: null }
    }

    const currentUser = auth.currentUser
    
    if (!currentUser) {
      return { session: null, error: null }
    }

    const session = {
      user: {
        id: currentUser.uid,
        email: currentUser.email || ''
      }
    }

    return { session, error: null }
  } catch (error: any) {
    return { session: null, error }
  }
}

export function onAuthStateChange(callback: (user: any) => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  return onAuthStateChanged(auth, (firebaseUser: User | null) => {
    if (firebaseUser) {
      callback({
        id: firebaseUser.uid,
        email: firebaseUser.email || ''
      })
    } else {
      callback(null)
    }
  })
}

