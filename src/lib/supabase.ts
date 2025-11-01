import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export interface Course {
  id: string
  title: string
  description: string
  file_url: string
  file_name: string
  file_type: string
  created_at: string
  updated_at: string
}

export interface Exercise {
  id: string
  title: string
  description: string
  file_url: string
  file_name: string
  file_type: string
  correction_url?: string
  correction_name?: string
  created_at: string
  updated_at: string
}
