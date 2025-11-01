'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Mathématiques - Algèbre",
      description: "Cours d'introduction à l'algèbre linéaire",
      file_name: "cours_algebre.pdf",
      created_at: "2024-01-15"
    },
    {
      id: 2,
      title: "Physique - Mécanique",
      description: "Les lois fondamentales de la mécanique",
      file_name: "cours_mecanique.pdf",
      created_at: "2024-01-20"
    }
  ])

  const [exercises, setExercises] = useState([
    {
      id: 1,
      title: "Exercices d'Algèbre",
      description: "Série d'exercices sur les équations",
      file_name: "exercices_algebre.pdf",
      correction_name: "correction_algebre.pdf",
      created_at: "2024-01-16"
    },
    {
      id: 2,
      title: "Problèmes de Mécanique",
      description: "Application des lois de Newton",
      file_name: "exercices_mecanique.pdf",
      correction_name: "correction_mecanique.pdf",
      created_at: "2024-01-21"
    }
  ])

  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showExerciseForm, setShowExerciseForm] = useState(false)

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    file: null as File | null
  })

  const [newExercise, setNewExercise] = useState({
    title: '',
    description: '',
    exerciseFile: null as File | null,
    correctionFile: null as File | null
  })

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCourse.title && newCourse.description) {
      const course = {
        id: courses.length + 1,
        title: newCourse.title,
        description: newCourse.description,
        file_name: newCourse.file?.name || 'fichier.pdf',
        created_at: new Date().toISOString().split('T')[0]
      }
      setCourses([...courses, course])
      setNewCourse({ title: '', description: '', file: null })
      setShowCourseForm(false)
    }
  }

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault()
    if (newExercise.title && newExercise.description) {
      const exercise = {
        id: exercises.length + 1,
        title: newExercise.title,
        description: newExercise.description,
        file_name: newExercise.exerciseFile?.name || 'exercice.pdf',
        correction_name: newExercise.correctionFile?.name || undefined,
        created_at: new Date().toISOString().split('T')[0]
      }
      setExercises([...exercises, exercise])
      setNewExercise({ title: '', description: '', exerciseFile: null, correctionFile: null })
      setShowExerciseForm(false)
    }
  }

  const deleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id))
  }

  const deleteExercise = (id: number) => {
    setExercises(exercises.filter(exercise => exercise.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">👨‍🏫 Administration</h1>
              <p className="text-gray-600">Gérez vos cours et exercices</p>
            </div>
            <a 
              href="/" 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              🏠 Retour au site
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-gray-600">Gérez vos cours et exercices</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📚</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Cours</h3>
                <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 text-lg">📝</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Exercices</h3>
                <p className="text-2xl font-bold text-green-600">{exercises.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => setShowCourseForm(!showCourseForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              📚 {showCourseForm ? 'Annuler' : 'Ajouter un cours'}
            </button>
            <button 
              onClick={() => setShowExerciseForm(!showExerciseForm)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              📝 {showExerciseForm ? 'Annuler' : 'Ajouter un exercice'}
            </button>
          </div>
        </div>

        {/* Course Form */}
        {showCourseForm && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un cours</h3>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du cours</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fichier (optionnel)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setNewCourse({...newCourse, file: e.target.files?.[0] || null})}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Ajouter le cours
              </button>
            </form>
          </div>
        )}

        {/* Exercise Form */}
        {showExerciseForm && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un exercice</h3>
            <form onSubmit={handleAddExercise} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'exercice</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newExercise.title}
                  onChange={(e) => setNewExercise({...newExercise, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newExercise.description}
                  onChange={(e) => setNewExercise({...newExercise, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fichier exercice</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={(e) => setNewExercise({...newExercise, exerciseFile: e.target.files?.[0] || null})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fichier correction (optionnel)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={(e) => setNewExercise({...newExercise, correctionFile: e.target.files?.[0] || null})}
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Ajouter l'exercice
              </button>
            </form>
          </div>
        )}

        {/* Courses List */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cours existants</h3>
          {courses.length === 0 ? (
            <p className="text-gray-500">Aucun cours ajouté</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    <p className="text-xs text-gray-500">📄 {course.file_name}</p>
                  </div>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exercises List */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercices existants</h3>
          {exercises.length === 0 ? (
            <p className="text-gray-500">Aucun exercice ajouté</p>
          ) : (
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-900">{exercise.title}</h4>
                    <p className="text-sm text-gray-600">{exercise.description}</p>
                    <div className="text-xs text-gray-500">
                      <p>📄 {exercise.file_name}</p>
                      {exercise.correction_name && <p>✅ {exercise.correction_name}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteExercise(exercise.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
