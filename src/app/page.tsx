'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  getResources,
  getCorrectionAccessRequests,
  createCorrectionAccessRequest,
  getCorrectionAccesses,
  hasCorrectionAccess,
  type Resource,
  type CorrectionAccessRequest,
  type CorrectionAccess
} from '@/lib/storage'

// Les 11 chapitres dans l'ordre
const CHAPTERS = [
  'Électricité et électrotechnique',
  'Les composants électriques',
  'Les composants pneumatiques',
  'Les composants hydrauliques',
  'Les automatismes',
  'La fabrication',
  'La mécanique',
  'Les méthodes de gestion et qualité',
  'Sécurité professionnelle, hygiène, environnement',
  'MSPC référentiel',
  'Annexe'
] as const

type ChapterName = typeof CHAPTERS[number]

export default function HomePage() {
  const [correctionAccesses, setCorrectionAccesses] = useState<CorrectionAccess[]>([])
  const [accessRequests, setAccessRequests] = useState<CorrectionAccessRequest[]>([])
  const [requestedExercises, setRequestedExercises] = useState<Set<number>>(new Set())
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [studentEmail, setStudentEmail] = useState('')
  const [viewResource, setViewResource] = useState<Resource | null>(null)

  // Charger les données au montage
  useEffect(() => {
    const savedEmail = localStorage.getItem('studentEmail')
    if (savedEmail) {
      setStudentEmail(savedEmail)
    }
    loadData()
  }, [])
  

  const loadData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
    }
    await Promise.all([
      loadResources(),
      loadAccessRequests(),
      loadAccesses()
    ])
    if (showLoading) {
      setLoading(false)
    }
  }

  const loadResources = async () => {
    const { data, error } = await getResources()
    if (error) {
      console.error('Error loading resources:', error)
    } else {
      setResources(data || [])
    }
  }

  const loadAccessRequests = async () => {
    const { data, error } = await getCorrectionAccessRequests()
    if (error) {
      console.error('Error loading access requests:', error)
    } else {
      setAccessRequests(data || [])
      // Mettre à jour les demandes en attente
      if (studentEmail) {
        const pending = (data || []).filter(r => r.status === 'pending' && r.studentEmail === studentEmail)
        setRequestedExercises(new Set(pending.map(r => r.exerciseId)))
      }
    }
  }

  const loadAccesses = async () => {
    const { data, error } = await getCorrectionAccesses()
    if (error) {
      console.error('Error loading accesses:', error)
    } else {
      setCorrectionAccesses(data || [])
    }
  }

  // Polling pour rafraîchir les données (sans écran de chargement)
  useEffect(() => {
    const interval = setInterval(() => {
      const savedEmail = localStorage.getItem('studentEmail')
      if (savedEmail) {
        setStudentEmail(savedEmail)
        loadData(false) // Rafraîchir sans afficher l'écran de chargement
      }
    }, 5000) // Rafraîchir toutes les 5 secondes

    return () => clearInterval(interval)
  }, [])

  // Fonction synchrone pour vérifier l'accès depuis l'état local
  const hasAccessToCorrectionSync = (resourceId: number): boolean => {
    if (!studentEmail) return false
    return correctionAccesses.some(
      access => access.exerciseId === resourceId && access.studentEmail === studentEmail
    )
  }

  // Fonction asynchrone pour vérifier l'accès (utilisée dans les handlers)
  const hasAccessToCorrection = async (resourceId: number): Promise<boolean> => {
    if (!studentEmail) return false
    return await hasCorrectionAccess(resourceId, studentEmail)
  }

  const hasPendingRequest = (resourceId: number): boolean => {
    return accessRequests.some(
      req => req.exerciseId === resourceId && 
             req.studentEmail === studentEmail && 
             req.status === 'pending'
    )
  }

  const requestCorrectionAccess = async (resourceId: number) => {
    const savedEmail = localStorage.getItem('studentEmail')
    if (!savedEmail || !savedEmail.trim()) {
      const email = prompt('Veuillez entrer votre email pour demander l\'accès à la correction:')
      if (!email || !email.trim()) {
        return
      }
      localStorage.setItem('studentEmail', email.trim())
      setStudentEmail(email.trim())
    } else {
      setStudentEmail(savedEmail)
    }
    
    const currentEmail = studentEmail || localStorage.getItem('studentEmail') || ''
    
    if (!currentEmail || !currentEmail.trim()) {
      return
    }

    // Vérifier si une demande est déjà en attente
    if (hasPendingRequest(resourceId)) {
      alert('Vous avez déjà une demande en attente pour cette ressource.')
      return
    }

    try {
      console.log('Creating access request for resource:', resourceId, 'email:', currentEmail)
      const { data, error } = await createCorrectionAccessRequest(resourceId, currentEmail)
      
      if (error) {
        console.error('Error creating request:', error)
        alert('Erreur lors de la demande: ' + (error.message || JSON.stringify(error)))
        return
      }

      console.log('Request created successfully:', data)
      // Rafraîchir les données
      await loadAccessRequests()
      await loadAccesses()
      
      // Mettre à jour l'état local
      setRequestedExercises(new Set([...requestedExercises, resourceId]))
      
      alert('✅ Demande d\'accès envoyée avec succès! Le professeur va bientôt la valider.')
    } catch (error: any) {
      console.error('Error requesting access:', error)
      alert('Erreur lors de la demande d\'accès: ' + (error?.message || 'Erreur inconnue'))
    }
  }

  const handleDownload = async (resource: Resource, isCorrection: boolean = false) => {
    try {
      const fileName = isCorrection && resource.correction_name 
        ? resource.correction_name 
        : resource.file_name
      
      if (isCorrection) {
        const hasAccess = await hasAccessToCorrection(resource.id)
        if (!hasAccess) {
          alert('Vous n\'avez pas accès à cette correction. Veuillez demander l\'accès d\'abord.')
          return
        }
      }

      const fileUrl = isCorrection && resource.correction_url 
        ? resource.correction_url 
        : resource.file_url

      if (fileUrl) {
        const link = document.createElement('a')
        link.href = fileUrl
        link.download = fileName
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert('Aucun fichier disponible pour cette ressource.')
      }
    } catch (error) {
      console.error('Error in handleDownload:', error)
      alert('Erreur lors du téléchargement. Veuillez réessayer.')
    }
  }

  const handleView = (resource: Resource) => {
    if (resource.file_url) {
      setViewResource(resource)
    } else {
      alert('Aucun fichier disponible pour cette ressource.')
    }
  }

  const handleViewCorrection = async (resource: Resource) => {
    if (!resource.correction_name) {
      return
    }

    // Vérifier l'accès
    const hasAccess = await hasAccessToCorrection(resource.id)
    if (!hasAccess) {
      alert('Vous n\'avez pas accès à cette correction. Veuillez demander l\'accès d\'abord.')
      return
    }

    handleDownload(resource, true)
  }

  // Grouper les ressources par chapitre et par type
  const groupedResources = CHAPTERS.reduce((acc, chapitre) => {
    acc[chapitre] = {
      TP: resources.filter(r => r.chapitre === chapitre && r.type === 'TP'),
      Synthèse: resources.filter(r => r.chapitre === chapitre && r.type === 'Synthèse'),
      Exercice: resources.filter(r => r.chapitre === chapitre && r.type === 'Exercice'),
      Ressource: resources.filter(r => r.chapitre === chapitre && r.type === 'Ressource'),
      Correction: resources.filter(r => r.chapitre === chapitre && r.type === 'Correction')
    }
    return acc
  }, {} as Record<ChapterName, Record<'TP' | 'Synthèse' | 'Exercice' | 'Ressource' | 'Correction', Resource[]>>)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-2xl border-b-4 border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6 sm:py-8">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">🎓 Cours MSPC</h1>
              <p className="text-sm sm:text-base text-blue-100">Cours et exercices en ligne</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link 
                href="/login" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center text-sm whitespace-nowrap border-2 border-white/30"
              >
                👨‍🏫 Connexion Professeur
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="text-6xl sm:text-7xl">🎓</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4 sm:mb-6">
            Bienvenue sur la plateforme
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto px-4 font-medium">
            Accédez aux cours et exercices partagés par votre professeur
          </p>
        </div>

        {/* Chapters Section */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-xl text-gray-600">Chargement des ressources...</p>
          </div>
        ) : (
        <div className="space-y-12">
          {CHAPTERS.map((chapitre) => {
            const chapterResources = groupedResources[chapitre]
            const hasResources = Object.values(chapterResources).some(arr => arr.length > 0)
            const isSpecialChapter = chapitre === 'MSPC référentiel' || chapitre === 'Annexe'
            
            return (
              <section key={chapitre} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border-2 border-gray-200 hover:border-red-300 p-6 sm:p-8 transition-all hover:shadow-2xl">
                <div className={`mb-6 sm:mb-8 pb-4 border-b-2 ${isSpecialChapter ? 'border-red-500' : 'border-red-200'}`}>
                  <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold drop-shadow-sm ${isSpecialChapter ? 'text-red-600' : 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-700'}`}>
                    {chapitre}
                  </h3>
                </div>
                
                {!hasResources ? (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-5xl mb-3 opacity-50">📚</div>
                    <p className="text-gray-600 font-medium">Aucune ressource disponible pour ce chapitre</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {/* TP */}
                    {chapterResources.TP.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📋</span>
                          </div>
                          <h4 className="text-xl sm:text-2xl font-bold text-gray-900">TP</h4>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{chapterResources.TP.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {chapterResources.TP.map((resource) => (
                            <div key={resource.id} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all group">
                              <h5 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{resource.title}</h5>
                              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{resource.description}</p>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-3 border-t border-gray-200">
                                <span className="text-xs text-gray-600 truncate flex-1 font-medium w-full sm:w-auto">📄 {resource.file_name}</span>
                                <div className="flex gap-2 w-full sm:w-auto sm:ml-2">
                                  {resource.file_url && (
                                    <button 
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleView(resource)
                                      }}
                                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                                    >
                                      👁️ Voir
                                    </button>
                                  )}
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleDownload(resource)
                                    }}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                                  >
                                    📥 Télécharger
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Synthèse */}
                    {chapterResources.Synthèse.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📝</span>
                          </div>
                          <h4 className="text-xl sm:text-2xl font-bold text-gray-900">Synthèse</h4>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">{chapterResources.Synthèse.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {chapterResources.Synthèse.map((resource) => (
                            <div key={resource.id} className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all group">
                              <h5 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{resource.title}</h5>
                              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{resource.description}</p>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-3 border-t border-gray-200">
                                <span className="text-xs text-gray-600 truncate flex-1 font-medium w-full sm:w-auto">📄 {resource.file_name}</span>
                                <div className="flex gap-2 w-full sm:w-auto sm:ml-2">
                                  {resource.file_url && (
                                    <button 
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleView(resource)
                                      }}
                                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                                    >
                                      👁️ Voir
                                    </button>
                                  )}
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleDownload(resource)
                                    }}
                                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                                  >
                                    📥 Télécharger
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exercice */}
                    {chapterResources.Exercice.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">✏️</span>
                          </div>
                          <h4 className="text-xl sm:text-2xl font-bold text-gray-900">Exercice</h4>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">{chapterResources.Exercice.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {chapterResources.Exercice.map((resource) => {
                            const hasAccess = hasAccessToCorrectionSync(resource.id)
                            const hasPending = hasPendingRequest(resource.id)
                            return (
                              <div key={resource.id} className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all group">
                                <h5 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{resource.title}</h5>
                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{resource.description}</p>
                                <div className="space-y-3">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-3 border-t border-gray-200">
                                    <span className="text-xs text-gray-600 truncate flex-1 font-medium w-full sm:w-auto">📄 {resource.file_name}</span>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                      {resource.file_url && (
                                        <button 
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleView(resource)
                                          }}
                                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer flex-1 sm:flex-none"
                                        >
                                          👁️ Voir
                                        </button>
                                      )}
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          handleDownload(resource)
                                        }}
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer flex-1 sm:flex-none"
                                      >
                                        📥 Télécharger
                                      </button>
                                    </div>
                                  </div>
                                  {resource.correction_name && (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-3 border-t-2 border-gray-300">
                                      <span className="text-xs text-gray-600 truncate flex-1 font-medium w-full sm:w-auto">✅ {resource.correction_name}</span>
                                      {hasAccess ? (
                                        <button 
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleViewCorrection(resource)
                                          }}
                                          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 sm:ml-2 whitespace-nowrap cursor-pointer w-full sm:w-auto"
                                        >
                                          📥 Voir correction
                                        </button>
                                      ) : hasPending ? (
                                        <button disabled className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold cursor-not-allowed opacity-75 sm:ml-2 shadow-sm w-full sm:w-auto">
                                          ⏳ En attente
                                        </button>
                                      ) : (
                                    <button 
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        requestCorrectionAccess(resource.id)
                                      }}
                                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 sm:ml-2 whitespace-nowrap cursor-pointer w-full sm:w-auto"
                                    >
                                      🔒 Demander accès
                                    </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Ressource */}
                    {chapterResources.Ressource.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📚</span>
                          </div>
                          <h4 className="text-xl sm:text-2xl font-bold text-gray-900">Ressource</h4>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">{chapterResources.Ressource.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {chapterResources.Ressource.map((resource) => (
                            <div key={resource.id} className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-5 border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all group">
                              <h5 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{resource.title}</h5>
                              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{resource.description}</p>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-3 border-t border-gray-200">
                                <span className="text-xs text-gray-600 truncate flex-1 font-medium w-full sm:w-auto">📄 {resource.file_name}</span>
                                <div className="flex gap-2 w-full sm:w-auto sm:ml-2">
                                  {resource.file_url && (
                                    <button 
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleView(resource)
                                      }}
                                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                                    >
                                      👁️ Voir
                                    </button>
                                  )}
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleDownload(resource)
                                    }}
                                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                                  >
                                    📥 Télécharger
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Correction */}
                    {chapterResources.Correction.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                          </div>
                          <h4 className="text-xl sm:text-2xl font-bold text-gray-900">Correction</h4>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">{chapterResources.Correction.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {chapterResources.Correction.map((resource) => {
                            const hasAccess = hasAccessToCorrectionSync(resource.id)
                            const hasPending = hasPendingRequest(resource.id)
                            return (
                              <div key={resource.id} className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-5 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all group">
                                <h5 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{resource.title}</h5>
                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{resource.description}</p>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                  <span className="text-xs text-gray-600 truncate flex-1 font-medium">✅ {resource.file_name}</span>
                                  {hasAccess ? (
                                    <div className="flex gap-2 ml-2">
                                      {resource.file_url && (
                                        <button 
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleView(resource)
                                          }}
                                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                                        >
                                          👁️ Voir
                                        </button>
                                      )}
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          handleDownload(resource)
                                        }}
                                        className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                                      >
                                        📥 Télécharger
                                      </button>
                                    </div>
                                  ) : hasPending ? (
                                    <button disabled className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-not-allowed opacity-75 ml-2 shadow-sm">
                                      ⏳ En attente
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        requestCorrectionAccess(resource.id)
                                      }}
                                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ml-2 whitespace-nowrap cursor-pointer"
                                    >
                                      🔒 Demander accès
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )
          })}
        </div>
        )}
      </main>

      {/* Modal Visualisation */}
      {viewResource && viewResource.file_url && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewResource(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col border-2 border-gray-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2 p-4 border-b-2 border-gray-200">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{viewResource.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{viewResource.chapitre} - {viewResource.type}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (viewResource.file_url) {
                      const link = document.createElement('a')
                      link.href = viewResource.file_url
                      link.download = viewResource.file_name
                      link.target = '_blank'
                      link.rel = 'noopener noreferrer'
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all shadow-md text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  📥 Télécharger
                </button>
                <button
                  onClick={() => setViewResource(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  ✖️ Fermer
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {viewResource.file_url && (
                <iframe
                  src={`${viewResource.file_url}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-full border-0"
                  title={viewResource.title}
                  onError={() => {
                    console.error('Erreur lors du chargement du fichier dans l\'iframe')
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white py-8 sm:py-12 mt-16 sm:mt-20 border-t-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <p className="text-sm sm:text-base font-medium text-gray-300">&copy; 2024 Cours MSPC. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}