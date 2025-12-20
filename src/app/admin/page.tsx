'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { 
  getResources, 
  createResource, 
  deleteResource,
  getCorrectionAccessRequests,
  updateCorrectionAccessRequest,
  type Resource,
  type CorrectionAccessRequest
} from '@/lib/storage'
import { getSession, signOut, getCurrentUser } from '@/lib/auth'

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


export default function AdminPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [showQRCode, setShowQRCode] = useState<Resource | null>(null)
  const [viewResource, setViewResource] = useState<Resource | null>(null)
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()

  // Vérifier l'authentification au montage
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { session } = await getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { user: currentUser } = await getCurrentUser()
      setUser(currentUser)
      setAuthLoading(false)
      
      loadResources()
      loadAccessRequests()
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/login')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Charger les ressources au montage
  useEffect(() => {
    if (!authLoading && user) {
      loadResources()
      loadAccessRequests()
    }
  }, [authLoading, user])

  const loadResources = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
    }
    try {
      const { data, error } = await getResources()
      if (error) {
        console.error('Error loading resources:', error)
        if (showLoading) {
          alert(`Erreur lors du chargement: ${error.message || JSON.stringify(error)}`)
        }
        setResources([])
      } else {
        setResources(data || [])
      }
    } catch (error: any) {
      console.error('Unexpected error:', error)
      setResources([])
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  const loadAccessRequests = async () => {
    const { data, error } = await getCorrectionAccessRequests()
    if (error) {
      console.error('Error loading access requests:', error)
    } else {
      setAccessRequests(data || [])
    }
  }

  const [showResourceForm, setShowResourceForm] = useState(false)

  const [newResource, setNewResource] = useState<{
    title: string
    description: string
    chapitre: string
    type: Resource['type']
    file: File | null
  }>({
    title: '',
    description: '',
    chapitre: CHAPTERS[0],
    type: 'Ressource',
    file: null
  })

  const [accessRequests, setAccessRequests] = useState<CorrectionAccessRequest[]>([])
  const [showRequestsTab, setShowRequestsTab] = useState(false)

  // Polling pour rafraîchir les données (sans écran de chargement)
  useEffect(() => {
    const interval = setInterval(() => {
      loadResources(false) // Rafraîchir sans afficher l'écran de chargement
      loadAccessRequests()
    }, 5000) // Rafraîchir toutes les 5 secondes

    return () => clearInterval(interval)
  }, [])

  const pendingRequests = accessRequests.filter(req => req.status === 'pending')

  const getResourceTitle = (resourceId: number): string => {
    const resource = resources.find(r => r.id === resourceId)
    return resource?.title || `Ressource #${resourceId}`
  }

  const approveRequest = async (requestId: string) => {
    try {
      const { data, error } = await updateCorrectionAccessRequest(requestId, 'approved')
      if (error) {
        alert('Erreur lors de l\'approbation: ' + error.message)
      } else {
        await loadAccessRequests() // Rafraîchir la liste
      }
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Erreur lors de l\'approbation de la demande. Veuillez réessayer.')
    }
  }

  const rejectRequest = async (requestId: string) => {
    try {
      const { data, error } = await updateCorrectionAccessRequest(requestId, 'rejected')
      if (error) {
        alert('Erreur lors du rejet: ' + error.message)
      } else {
        await loadAccessRequests() // Rafraîchir la liste
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Erreur lors du rejet de la demande. Veuillez réessayer.')
    }
  }

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newResource.title || !newResource.description) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (!newResource.file) {
      alert('Veuillez sélectionner un fichier à uploader')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      setUploadProgress(30)
      const { data, error } = await createResource(
        {
          title: newResource.title,
          description: newResource.description,
          file_name: newResource.file?.name || 'fichier.pdf',
          chapitre: newResource.chapitre,
          type: newResource.type
        },
        newResource.file || undefined
      )

      setUploadProgress(100)

      if (error) {
        alert('Erreur lors de l\'ajout: ' + (error.message || 'Erreur inconnue'))
        setUploading(false)
        setUploadProgress(0)
      } else {
        await loadResources()
        setNewResource({ 
          title: '', 
          description: '', 
          chapitre: CHAPTERS[0],
          type: 'Ressource',
          file: null
        })
        setShowResourceForm(false)
        setUploading(false)
        setUploadProgress(0)
        alert('✅ Ressource ajoutée avec succès! Le fichier a été uploadé dans le cloud.')
      }
    } catch (error) {
      console.error('Error adding resource:', error)
      alert('Erreur lors de l\'ajout de la ressource')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteResource = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      return
    }

    try {
      const { error } = await deleteResource(id)
      if (error) {
        alert('Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'))
      } else {
        await loadResources() // Rafraîchir la liste
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
      alert('Erreur lors de la suppression de la ressource')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 shadow-xl border-b-4 border-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6 sm:py-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">👨‍🏫 Administration</h1>
              <p className="text-sm sm:text-base text-blue-100">Gérez vos cours et exercices</p>
              {user && (
                <p className="text-xs text-blue-200 mt-1">Connecté en tant que : {user.email}</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a 
                href="/" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 sm:px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap border-2 border-white/30 text-center"
              >
                🏠 Retour au site
              </a>
              <button
                onClick={handleSignOut}
                className="bg-red-500/80 hover:bg-red-600 backdrop-blur-sm text-white px-4 sm:px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap border-2 border-red-400/50"
              >
                🚪 Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">Tableau de bord</h2>
          <p className="text-lg text-gray-600">Gérez efficacement vos ressources pédagogiques</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 bg-white rounded-xl shadow-lg p-2 border-2 border-gray-200">
          <button
            onClick={() => setShowRequestsTab(false)}
            className={`px-6 py-3 font-semibold text-sm rounded-lg transition-all ${
              !showRequestsTab
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            📚 Contenu
          </button>
          <button
            onClick={() => setShowRequestsTab(true)}
            className={`px-6 py-3 font-semibold text-sm rounded-lg transition-all relative ${
              showRequestsTab
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            🔔 Demandes d'accès
            {pendingRequests.length > 0 && (
              <span className="ml-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-2.5 py-1 font-bold shadow-md">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Access Requests Section */}
        {showRequestsTab && (
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 border-2 border-gray-200 mb-6 sm:mb-8">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">🔔 Demandes d'accès aux corrections</h3>
              <p className="text-gray-600">Gérez les demandes d'accès des étudiants</p>
            </div>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-dashed border-green-200">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-lg font-semibold text-gray-700 mb-2">Aucune demande en attente</p>
                <p className="text-sm text-gray-600">Toutes les demandes ont été traitées</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-900 mb-2">
                        {getResourceTitle(request.exerciseId)}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-medium">
                          👤 {request.studentEmail}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                          📅 {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => approveRequest(request.id)}
                        className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap flex-1 sm:flex-none"
                      >
                        ✅ Approuver
                      </button>
                      <button
                        onClick={() => rejectRequest(request.id)}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap flex-1 sm:flex-none"
                      >
                        ❌ Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        {!showRequestsTab && (
          <>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-xl p-6 border-2 border-blue-400 mb-6 sm:mb-8 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-3xl">📚</span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-semibold text-white/90 mb-1">Total des ressources</h3>
                    <p className="text-4xl font-bold text-white">{resources.length}</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-5xl text-white/30">🎓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border-2 border-blue-100 mb-6 sm:mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Actions rapides</h3>
                  <p className="text-sm text-gray-600">Gérez vos ressources pédagogiques</p>
                </div>
                <button 
                  onClick={() => setShowResourceForm(!showResourceForm)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  {showResourceForm ? '✖️ Annuler' : '➕ Ajouter une ressource'}
                </button>
              </div>
            </div>

            {/* Resource Form */}
            {showResourceForm && (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 sm:p-8 border-2 border-gray-200 mb-6 sm:mb-8">
                <div className="mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">✨ Ajouter une ressource</h3>
                  <p className="text-gray-600">Remplissez les informations ci-dessous pour ajouter une nouvelle ressource</p>
                </div>
                <form onSubmit={handleAddResource} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Titre</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                      value={newResource.title}
                      onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md resize-none"
                      value={newResource.description}
                      onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Chapitre</label>
                    <select
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md cursor-pointer"
                      value={newResource.chapitre}
                      onChange={(e) => setNewResource({...newResource, chapitre: e.target.value})}
                    >
                      {CHAPTERS.map((chapitre) => (
                        <option key={chapitre} value={chapitre} className="text-gray-900">{chapitre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Type</label>
                    <select
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md cursor-pointer"
                      value={newResource.type}
                      onChange={(e) => setNewResource({...newResource, type: e.target.value as Resource['type']})}
                    >
                      <option value="TP" className="text-gray-900">TP</option>
                      <option value="Synthèse" className="text-gray-900">Synthèse</option>
                      <option value="Exercice" className="text-gray-900">Exercice</option>
                      <option value="Ressource" className="text-gray-900">Ressource</option>
                      <option value="Correction" className="text-gray-900">Correction</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Fichier principal <span className="text-blue-600">(sera stocké dans le cloud)</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      required
                      disabled={uploading}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onChange={(e) => setNewResource({...newResource, file: e.target.files?.[0] || null})}
                    />
                    {newResource.file && (
                      <p className="mt-2 text-sm text-green-600">
                        📄 Fichier sélectionné : {newResource.file.name} ({(newResource.file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                  {uploading && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-blue-800">Upload en cours...</span>
                        <span className="text-sm font-semibold text-blue-800">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">Le fichier est en train d'être uploadé dans Firebase Storage...</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {uploading ? '⏳ Upload en cours...' : '✨ Ajouter la ressource'}
                  </button>
                </form>
              </div>
            )}

            {/* Resources List */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-gray-200">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">📋 Ressources existantes</h3>
                <p className="text-gray-600">Liste de toutes vos ressources pédagogiques</p>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Chargement des ressources...</p>
                </div>
              ) : resources.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
                  <div className="text-5xl mb-3">📚</div>
                  <p className="text-base font-medium text-gray-700 mb-1">Aucune ressource disponible actuellement</p>
                  <p className="text-sm text-gray-500">Commencez par ajouter votre première ressource</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{resource.title}</h4>
                          <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full font-semibold shadow-sm">{resource.type}</span>
                          <span className="text-xs px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-full font-semibold shadow-sm line-clamp-1 max-w-xs">{resource.chapitre}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{resource.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1 px-2 py-1 bg-white rounded-md border border-gray-200">
                            📄 {resource.file_name}
                          </span>
                          {resource.correction_name && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-md border border-green-200 text-green-700">
                              ✅ {resource.correction_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {resource.file_url && (
                          <button
                            onClick={() => setViewResource(resource)}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                          >
                            👁️ Voir
                          </button>
                        )}
                        <button
                          onClick={() => setShowQRCode(resource)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                          📱 QR Code
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Modal Visualisation */}
      {viewResource && viewResource.file_url && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewResource(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col border-2 border-gray-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b-2 border-gray-200">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{viewResource.title}</h3>
                <p className="text-sm text-gray-600">{viewResource.chapitre} - {viewResource.type}</p>
              </div>
              <div className="flex gap-2">
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
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md text-sm"
                >
                  📥 Télécharger
                </button>
                <button
                  onClick={() => setViewResource(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all text-sm"
                >
                  ✖️ Fermer
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`${viewResource.file_url}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full border-0"
                title={viewResource.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowQRCode(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-gray-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">📱 QR Code</h3>
              <button
                onClick={() => setShowQRCode(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-700 font-semibold mb-2">{showQRCode.title}</p>
              <p className="text-sm text-gray-600 mb-4">{showQRCode.chapitre} - {showQRCode.type}</p>
              
              <div className="bg-white p-6 rounded-xl border-4 border-blue-200 inline-block mb-4">
                {showQRCode.file_url ? (
                  <QRCodeSVG
                    value={showQRCode.file_url}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-500 text-sm text-center px-4">
                      Aucun fichier disponible pour cette ressource
                    </p>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mb-4">
                Scannez ce QR code pour télécharger le document
              </p>
              
              {showQRCode.file_url && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-blue-800 font-mono break-all">
                    {showQRCode.file_url}
                  </p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQRCode(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  Fermer
                </button>
                {showQRCode.file_url && (
                  <button
                    onClick={() => {
                      if (showQRCode.file_url) {
                        const link = document.createElement('a')
                        link.href = showQRCode.file_url
                        link.download = showQRCode.file_name
                        link.target = '_blank'
                        link.rel = 'noopener noreferrer'
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md"
                  >
                    📥 Télécharger
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
