// Couche d'abstraction pour le stockage (Supabase ou localStorage)
import { 
  getResources as getResourcesSupabase,
  createResource as createResourceSupabase,
  updateResource as updateResourceSupabase,
  deleteResource as deleteResourceSupabase,
  uploadFile as uploadFileSupabase,
  getCorrectionAccessRequests as getAccessRequestsSupabase,
  createCorrectionAccessRequest as createAccessRequestSupabase,
  updateCorrectionAccessRequest as updateAccessRequestSupabase,
  getCorrectionAccesses as getAccessesSupabase,
  hasCorrectionAccess as hasAccessSupabase,
  type Resource as ResourceSupabase,
  type CorrectionAccessRequest as CorrectionAccessRequestSupabase,
  type CorrectionAccess as CorrectionAccessSupabase
} from './supabase'


// Types compatibles avec les deux systèmes
export type Resource = {
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

export type CorrectionAccessRequest = {
  id: string
  exerciseId: number
  exercise_id?: number
  studentEmail: string
  student_email?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  created_at?: string
}

export type CorrectionAccess = {
  id?: number
  exerciseId: number
  exercise_id?: number
  studentEmail: string
  student_email?: string
  created_at?: string
}

// Convertir entre les formats
function convertResourceFromSupabase(resource: any): Resource {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    file_name: resource.file_name,
    file_url: resource.file_url,
    correction_name: resource.correction_name,
    correction_url: resource.correction_url,
    chapitre: resource.chapitre,
    type: resource.type,
    created_at: resource.created_at,
    updated_at: resource.updated_at
  }
}

function convertResourceToSupabase(resource: Omit<Resource, 'id' | 'created_at'>): Omit<ResourceSupabase, 'id' | 'created_at'> {
  return {
    title: resource.title,
    description: resource.description,
    file_name: resource.file_name,
    file_url: resource.file_url,
    correction_name: resource.correction_name,
    correction_url: resource.correction_url,
    chapitre: resource.chapitre,
    type: resource.type
  }
}

// Fonction interne pour vérifier Supabase
const checkSupabase = () => {
  if (typeof window === 'undefined') return false
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return url && url !== 'https://placeholder.supabase.co' && key && key !== 'placeholder_key'
}

// Fonctions pour les ressources
export async function getResources(): Promise<{ data: Resource[] | null; error: any }> {
  if (checkSupabase()) {
    try {
      const result = await getResourcesSupabase()
      if (result.error) {
        // Si l'erreur indique que la table n'existe pas, fallback vers localStorage
        const errorMsg = result.error.message || JSON.stringify(result.error)
        if (errorMsg.includes('relation') && errorMsg.includes('does not exist')) {
          console.warn('Table Supabase n\'existe pas encore, utilisation de localStorage')
          // Fallback sur localStorage
        } else {
          // Autre erreur, on la retourne mais avec fallback
          console.error('Erreur Supabase:', result.error)
        }
        // Continue vers localStorage
      } else {
        const converted = (result.data || []).map(convertResourceFromSupabase)
        return { data: converted, error: null }
      }
    } catch (error: any) {
      console.error('Error with Supabase, falling back to localStorage:', error)
      // Fallback sur localStorage
    }
  }

  // localStorage fallback
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('resources')
    if (saved) {
      try {
        return { data: JSON.parse(saved), error: null }
      } catch (e) {
        return { data: null, error: e }
      }
    }
  }
  return { data: [], error: null }
}

export async function createResource(resource: Omit<Resource, 'id' | 'created_at'>, file?: File, correctionFile?: File): Promise<{ data: Resource | null; error: any }> {
  if (checkSupabase()) {
    try {
      let fileUrl: string | undefined
      let correctionUrl: string | undefined

      // Upload des fichiers si fournis
      if (file) {
        const uploadResult = await uploadFileSupabase(file, 'resources')
        if (uploadResult.error) {
          return { data: null, error: uploadResult.error }
        }
        fileUrl = uploadResult.data?.url
      }

      if (correctionFile) {
        const uploadResult = await uploadFileSupabase(correctionFile, 'corrections')
        if (uploadResult.error) {
          return { data: null, error: uploadResult.error }
        }
        correctionUrl = uploadResult.data?.url
      }

      const supabaseResource = convertResourceToSupabase({
        ...resource,
        file_url: fileUrl,
        correction_url: correctionUrl
      })

      const result = await createResourceSupabase(supabaseResource)
      if (result.error) {
        return { data: null, error: result.error }
      }
      return { data: convertResourceFromSupabase(result.data), error: null }
    } catch (error) {
      console.error('Error with Supabase, falling back to localStorage:', error)
    }
  }

  // localStorage fallback
  if (typeof window !== 'undefined') {
    const newResource: Resource = {
      ...resource,
      id: Date.now(),
      created_at: new Date().toISOString()
    }
    const saved = localStorage.getItem('resources')
    const resources = saved ? JSON.parse(saved) : []
    resources.push(newResource)
    localStorage.setItem('resources', JSON.stringify(resources))
    return { data: newResource, error: null }
  }
  return { data: null, error: 'No storage available' }
}

export async function deleteResource(id: number): Promise<{ error: any }> {
  if (checkSupabase()) {
    try {
      return await deleteResourceSupabase(id)
    } catch (error) {
      console.error('Error with Supabase, falling back to localStorage:', error)
    }
  }

  // localStorage fallback
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('resources')
    if (saved) {
      const resources = JSON.parse(saved)
      const updated = resources.filter((r: Resource) => r.id !== id)
      localStorage.setItem('resources', JSON.stringify(updated))
    }
  }
  return { error: null }
}

// Fonctions pour les demandes d'accès
export async function getCorrectionAccessRequests(): Promise<{ data: CorrectionAccessRequest[] | null; error: any }> {
  if (checkSupabase()) {
    try {
      const result = await getAccessRequestsSupabase()
      if (result.error) {
        return { data: null, error: result.error }
      }
      const converted = (result.data || []).map((req: any) => ({
        id: req.id,
        exerciseId: req.exercise_id,
        studentEmail: req.student_email,
        status: req.status,
        createdAt: req.created_at
      }))
      return { data: converted, error: null }
    } catch (error) {
      console.error('Error with Supabase, falling back to localStorage:', error)
    }
  }

  // localStorage fallback
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('accessRequests')
    if (saved) {
      try {
        return { data: JSON.parse(saved), error: null }
      } catch (e) {
        return { data: null, error: e }
      }
    }
  }
  return { data: [], error: null }
}

export async function createCorrectionAccessRequest(exerciseId: number, studentEmail: string): Promise<{ data: CorrectionAccessRequest | null; error: any }> {
  if (checkSupabase()) {
    try {
      const result = await createAccessRequestSupabase({
        exercise_id: exerciseId,
        student_email: studentEmail
      })
      if (result.error) {
        return { data: null, error: result.error }
      }
      return {
        data: {
          id: result.data.id,
          exerciseId: result.data.exercise_id,
          studentEmail: result.data.student_email,
          status: result.data.status,
          createdAt: result.data.created_at
        },
        error: null
      }
    } catch (error) {
      console.error('Error with Supabase, falling back to localStorage:', error)
    }
  }

  // localStorage fallback
  if (typeof window !== 'undefined') {
    const newRequest: CorrectionAccessRequest = {
      id: Date.now().toString(),
      exerciseId,
      studentEmail,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    const saved = localStorage.getItem('accessRequests')
    const requests = saved ? JSON.parse(saved) : []
    requests.push(newRequest)
    localStorage.setItem('accessRequests', JSON.stringify(requests))
    return { data: newRequest, error: null }
  }
  return { data: null, error: 'No storage available' }
}

export async function updateCorrectionAccessRequest(id: string, status: 'approved' | 'rejected'): Promise<{ data: CorrectionAccessRequest | null; error: any }> {
  if (checkSupabase()) {
    try {
      const result = await updateAccessRequestSupabase(id, status)
      if (result.error) {
        return { data: null, error: result.error }
      }
      return {
        data: {
          id: result.data.id,
          exerciseId: result.data.exercise_id,
          studentEmail: result.data.student_email,
          status: result.data.status,
          createdAt: result.data.created_at
        },
        error: null
      }
    } catch (error) {
      console.error('Error with Supabase, falling back to localStorage:', error)
    }
  }

  // localStorage fallback
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('accessRequests')
    if (saved) {
      const requests: CorrectionAccessRequest[] = JSON.parse(saved)
      const updated = requests.map(r => r.id === id ? { ...r, status } : r)
      localStorage.setItem('accessRequests', JSON.stringify(updated))

      // Si approuvé, ajouter l'accès
      if (status === 'approved') {
        const request = requests.find(r => r.id === id)
        if (request) {
          const savedAccesses = localStorage.getItem('correctionAccesses')
          const accesses = savedAccesses ? JSON.parse(savedAccesses) : []
          const newAccess = {
            exerciseId: request.exerciseId,
            studentEmail: request.studentEmail
          }
          if (!accesses.some((a: CorrectionAccess) => a.exerciseId === request.exerciseId && a.studentEmail === request.studentEmail)) {
            accesses.push(newAccess)
            localStorage.setItem('correctionAccesses', JSON.stringify(accesses))
          }
        }
      }
      return { data: updated.find(r => r.id === id) || null, error: null }
    }
  }
  return { data: null, error: 'No storage available' }
}

// Fonctions pour les accès
export async function getCorrectionAccesses(): Promise<{ data: CorrectionAccess[] | null; error: any }> {
  if (checkSupabase()) {
    try {
      const result = await getAccessesSupabase()
      if (result.error) {
        return { data: null, error: result.error }
      }
      const converted = (result.data || []).map((acc: any) => ({
        id: acc.id,
        exerciseId: acc.exercise_id,
        studentEmail: acc.student_email,
        created_at: acc.created_at
      }))
      return { data: converted, error: null }
    } catch (error) {
      console.error('Error with Supabase, falling back to localStorage:', error)
    }
  }

  // localStorage fallback
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('correctionAccesses')
    if (saved) {
      try {
        return { data: JSON.parse(saved), error: null }
      } catch (e) {
        return { data: null, error: e }
      }
    }
  }
  return { data: [], error: null }
}

export async function hasCorrectionAccess(exerciseId: number, studentEmail: string): Promise<boolean> {
  if (checkSupabase()) {
    try {
      return await hasAccessSupabase(exerciseId, studentEmail)
    } catch (error) {
      console.error('Error with Supabase, falling back to localStorage:', error)
    }
  }

  // localStorage fallback
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('correctionAccesses')
    if (saved) {
      const accesses: CorrectionAccess[] = JSON.parse(saved)
      return accesses.some(a => a.exerciseId === exerciseId && a.studentEmail === studentEmail)
    }
  }
  return false
}

