import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export interface Resource {
  id: number
  title: string
  description: string
  file_name: string
  file_url?: string
  correction_name?: string
  correction_url?: string
  chapitre: string
  type: 'TP' | 'Synthèse' | 'Exercice' | 'Ressource' | 'Correction'
  created_at: string
  updated_at?: string
}

export interface CorrectionAccessRequest {
  id: string
  exercise_id: number
  student_email: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface CorrectionAccess {
  id?: number
  exercise_id: number
  student_email: string
  created_at?: string
}

// Fonctions pour gérer les ressources
export async function getResources() {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching resources:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createResource(resource: Omit<Resource, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('resources')
    .insert([resource])
    .select()
    .single()

  if (error) {
    console.error('Error creating resource:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function updateResource(id: number, updates: Partial<Resource>) {
  const { data, error } = await supabase
    .from('resources')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating resource:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function deleteResource(id: number) {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting resource:', error)
    return { error }
  }

  return { error: null }
}

// Fonctions pour le stockage de fichiers
export async function uploadFile(file: File, folder: string = 'resources'): Promise<{ data: { path: string; url: string } | null; error: any }> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from('files')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading file:', error)
    return { data: null, error }
  }

  // Obtenir l'URL publique du fichier
  const { data: urlData } = supabase.storage
    .from('files')
    .getPublicUrl(data.path)

  return {
    data: {
      path: data.path,
      url: urlData.publicUrl
    },
    error: null
  }
}

export async function deleteFile(filePath: string) {
  const { error } = await supabase.storage
    .from('files')
    .remove([filePath])

  if (error) {
    console.error('Error deleting file:', error)
    return { error }
  }

  return { error: null }
}

// Fonctions pour les demandes d'accès aux corrections
export async function getCorrectionAccessRequests() {
  const { data, error } = await supabase
    .from('correction_access_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching access requests:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createCorrectionAccessRequest(request: Omit<CorrectionAccessRequest, 'id' | 'created_at' | 'status'>) {
  const { data, error } = await supabase
    .from('correction_access_requests')
    .insert([{ ...request, status: 'pending' }])
    .select()
    .single()

  if (error) {
    console.error('Error creating access request:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function updateCorrectionAccessRequest(id: string, status: 'approved' | 'rejected') {
  const { data, error } = await supabase
    .from('correction_access_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating access request:', error)
    return { data: null, error }
  }

  // Si approuvé, créer l'accès
  if (status === 'approved' && data) {
    const { error: accessError } = await supabase
      .from('correction_accesses')
      .insert([{
        exercise_id: data.exercise_id,
        student_email: data.student_email
      }])

    if (accessError) {
      console.error('Error creating access:', accessError)
    }
  }

  return { data, error: null }
}

// Fonctions pour les accès aux corrections
export async function getCorrectionAccesses() {
  const { data, error } = await supabase
    .from('correction_accesses')
    .select('*')

  if (error) {
    console.error('Error fetching accesses:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function hasCorrectionAccess(exerciseId: number, studentEmail: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('correction_accesses')
    .select('*')
    .eq('exercise_id', exerciseId)
    .eq('student_email', studentEmail)
    .single()

  if (error || !data) {
    return false
  }

  return true
}
