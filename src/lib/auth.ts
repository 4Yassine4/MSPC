import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, error }
    }

    return { user: data.user, error: null }
  } catch (error: any) {
    return { user: null, error }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error: any) {
    return { error }
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { user: null, error }
    }

    return { user, error: null }
  } catch (error: any) {
    return { user: null, error }
  }
}

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return { session: null, error }
    }

    return { session, error: null }
  } catch (error: any) {
    return { session: null, error }
  }
}

export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}

