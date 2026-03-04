import { db, storage } from './firebase'
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  where,
  getDoc,
  Timestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export type Resource = {
  id: number
  title: string
  description: string
  file_name: string
  file_url?: string
  correction_name?: string
  correction_url?: string
  chapitre: string
  type: 'TP' | 'Synthèse' | 'Exercice' | 'Ressource' | 'Correction' | 'Vidéothèque'
  created_at: string
  updated_at?: string
}

export type CorrectionAccessRequest = {
  id: string
  exerciseId: number
  studentEmail: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export type CorrectionAccess = {
  id?: number
  exerciseId: number
  studentEmail: string
  created_at?: string
}

const checkFirestore = () => {
  return typeof window !== 'undefined' && db !== undefined && storage !== undefined
}

export async function getResources(): Promise<{ data: Resource[] | null; error: any }> {
  if (checkFirestore() && db) {
    try {
      const resourcesRef = collection(db, 'resources')
      const q = query(resourcesRef, orderBy('created_at', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const resources: Resource[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        resources.push({
          id: data.id || Date.now(),
          title: data.title || '',
          description: data.description || '',
          file_name: data.file_name || '',
          file_url: data.file_url || undefined,
          correction_name: data.correction_name || undefined,
          correction_url: data.correction_url || undefined,
          chapitre: data.chapitre || '',
          type: data.type || 'Ressource',
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at || new Date().toISOString(),
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at || undefined
        })
      })
      
      return { data: resources, error: null }
    } catch (error: any) {
      console.error('Error fetching resources from Firestore:', error)
      return { data: null, error }
    }
  }
  
  return { data: [], error: null }
}

export async function createResource(
  resource: Omit<Resource, 'id' | 'created_at'>, 
  file?: File, 
  correctionFile?: File
): Promise<{ data: Resource | null; error: any }> {
  if (checkFirestore()) {
    try {
      let fileUrl: string | undefined
      let correctionUrl: string | undefined

      if (file && storage) {
        const fileRef = ref(storage, `resources/${Date.now()}_${file.name}`)
        await uploadBytes(fileRef, file)
        fileUrl = await getDownloadURL(fileRef)
      }

      if (correctionFile && storage) {
        const correctionRef = ref(storage, `corrections/${Date.now()}_${correctionFile.name}`)
        await uploadBytes(correctionRef, correctionFile)
        correctionUrl = await getDownloadURL(correctionRef)
      }

      const newResource: any = {
        title: resource.title,
        description: resource.description,
        file_name: resource.file_name,
        chapitre: resource.chapitre,
        type: resource.type,
        created_at: Timestamp.now(),
        updated_at: null
      }

      if (fileUrl || resource.file_url) {
        newResource.file_url = fileUrl || resource.file_url
      }

      if (correctionFile?.name || resource.correction_name) {
        newResource.correction_name = correctionFile?.name || resource.correction_name
      }

      if (correctionUrl || resource.correction_url) {
        newResource.correction_url = correctionUrl || resource.correction_url
      }

      const numericId = Date.now()
      const resourceWithId: any = {
        id: numericId,
        title: newResource.title,
        description: newResource.description,
        file_name: newResource.file_name,
        chapitre: newResource.chapitre,
        type: newResource.type,
        created_at: newResource.created_at
      }

      if (newResource.file_url) {
        resourceWithId.file_url = newResource.file_url
      }

      if (newResource.correction_name) {
        resourceWithId.correction_name = newResource.correction_name
      }

      if (newResource.correction_url) {
        resourceWithId.correction_url = newResource.correction_url
      }
      
      const docRef = await addDoc(collection(db!, 'resources'), resourceWithId)
      
      const createdResource: Resource = {
        id: numericId,
        title: newResource.title,
        description: newResource.description,
        file_name: newResource.file_name,
        file_url: newResource.file_url || undefined,
        correction_name: newResource.correction_name || undefined,
        correction_url: newResource.correction_url || undefined,
        chapitre: newResource.chapitre,
        type: newResource.type,
        created_at: newResource.created_at.toDate().toISOString(),
        updated_at: undefined
      }

      return { data: createdResource, error: null }
    } catch (error: any) {
      console.error('Error creating resource in Firestore:', error)
      return { data: null, error }
    }
  }
  
  return { data: null, error: 'Firestore not available' }
}

export async function deleteResource(id: number): Promise<{ error: any }> {
  if (checkFirestore() && db && storage) {
    try {
      const resourcesRef = collection(db, 'resources')
      const q = query(resourcesRef, where('id', '==', id))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const docToDelete = querySnapshot.docs[0]
        const data = docToDelete.data()
        
        if (data.file_url) {
          try {
            const url = new URL(data.file_url)
            const path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0] || '')
            if (path) {
              const fileRef = ref(storage, path)
              await deleteObject(fileRef)
            }
          } catch (error) {
            console.warn('Error deleting file from storage:', error)
          }
        }
        
        if (data.correction_url) {
          try {
            const url = new URL(data.correction_url)
            const path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0] || '')
            if (path) {
              const correctionRef = ref(storage, path)
              await deleteObject(correctionRef)
            }
          } catch (error) {
            console.warn('Error deleting correction file from storage:', error)
          }
        }
        
        await deleteDoc(doc(db, 'resources', docToDelete.id))
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('Error deleting resource from Firestore:', error)
      return { error }
    }
  }
  
  return { error: null }
}

export async function getCorrectionAccessRequests(): Promise<{ data: CorrectionAccessRequest[] | null; error: any }> {
  if (checkFirestore() && db) {
    try {
      const requestsRef = collection(db, 'correction_access_requests')
      const q = query(requestsRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const requests: CorrectionAccessRequest[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        requests.push({
          id: doc.id,
          exerciseId: data.exerciseId || data.exercise_id,
          studentEmail: data.studentEmail || data.student_email,
          status: data.status,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString()
        })
      })
      
      return { data: requests, error: null }
    } catch (error: any) {
      console.error('Error fetching access requests from Firestore:', error)
      return { data: null, error }
    }
  }
  
  return { data: [], error: null }
}

export async function createCorrectionAccessRequest(
  exerciseId: number, 
  studentEmail: string
): Promise<{ data: CorrectionAccessRequest | null; error: any }> {
  if (checkFirestore() && db) {
    try {
      const newRequest = {
        exerciseId,
        studentEmail,
        status: 'pending',
        createdAt: Timestamp.now()
      }

      const docRef = await addDoc(collection(db, 'correction_access_requests'), newRequest)
      
      return {
        data: {
          id: docRef.id,
          exerciseId,
          studentEmail,
          status: 'pending',
          createdAt: newRequest.createdAt.toDate().toISOString()
        },
        error: null
      }
    } catch (error: any) {
      console.error('Error creating access request in Firestore:', error)
      return { data: null, error }
    }
  }
  
  return { data: null, error: 'Firestore not available' }
}

export async function updateCorrectionAccessRequest(
  id: string, 
  status: 'approved' | 'rejected'
): Promise<{ data: CorrectionAccessRequest | null; error: any }> {
  if (checkFirestore() && db) {
    try {
      const requestRef = doc(db, 'correction_access_requests', id)
      await updateDoc(requestRef, { status })

      if (status === 'approved') {
        const requestSnap = await getDoc(requestRef)
        if (requestSnap.exists()) {
          const data = requestSnap.data()
          const accessData = {
            exerciseId: data.exerciseId || data.exercise_id,
            studentEmail: data.studentEmail || data.student_email,
            created_at: Timestamp.now()
          }

          const accessQuery = query(
            collection(db!, 'correction_accesses'),
            where('exerciseId', '==', accessData.exerciseId),
            where('studentEmail', '==', accessData.studentEmail)
          )
          const accessSnapshot = await getDocs(accessQuery)

          if (accessSnapshot.empty) {
            await addDoc(collection(db!, 'correction_accesses'), accessData)
          }
        }
      }

      const updatedSnap = await getDoc(requestRef)
      if (updatedSnap.exists()) {
        const data = updatedSnap.data()
        return {
          data: {
            id: updatedSnap.id,
            exerciseId: data.exerciseId || data.exercise_id,
            studentEmail: data.studentEmail || data.student_email,
            status: data.status,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString()
          },
          error: null
        }
      }

      return { data: null, error: null }
    } catch (error: any) {
      console.error('Error updating access request in Firestore:', error)
      return { data: null, error }
    }
  }
  
  return { data: null, error: 'Firestore not available' }
}

export async function getCorrectionAccesses(): Promise<{ data: CorrectionAccess[] | null; error: any }> {
  if (checkFirestore() && db) {
    try {
      const accessesRef = collection(db, 'correction_accesses')
      const querySnapshot = await getDocs(accessesRef)
      
      const accesses: CorrectionAccess[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        accesses.push({
          id: parseInt(doc.id) || undefined,
          exerciseId: data.exerciseId || data.exercise_id,
          studentEmail: data.studentEmail || data.student_email,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at
        })
      })
      
      return { data: accesses, error: null }
    } catch (error: any) {
      console.error('Error fetching accesses from Firestore:', error)
      return { data: null, error }
    }
  }
  
  return { data: [], error: null }
}

export async function hasCorrectionAccess(exerciseId: number, studentEmail: string): Promise<boolean> {
  if (checkFirestore() && db) {
    try {
      const accessesRef = collection(db, 'correction_accesses')
      const q = query(
        accessesRef,
        where('exerciseId', '==', exerciseId),
        where('studentEmail', '==', studentEmail)
      )
      const querySnapshot = await getDocs(q)
      
      return !querySnapshot.empty
    } catch (error: any) {
      console.error('Error checking access in Firestore:', error)
      return false
    }
  }
  
  return false
}
