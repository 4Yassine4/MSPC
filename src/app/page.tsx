import Link from 'next/link'

// Données simulées pour la démonstration
const courses = [
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
]

const exercises = [
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
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎓 Plateforme Éducative</h1>
              <p className="text-gray-600">Cours et exercices en ligne</p>
            </div>
            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-md"
            >
              👨‍🏫 Connexion Prof
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur la plateforme
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accédez aux cours et exercices partagés par votre professeur
          </p>
        </div>

        {/* Courses Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">📚 Cours disponibles</h3>
          {courses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-500">Aucun cours disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h4>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      📄 {course.file_name}
                    </span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      📥 Télécharger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Exercises Section */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">📝 Exercices</h3>
          {exercises.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-500">Aucun exercice disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {exercise.title}
                  </h4>
                  <p className="text-gray-600 mb-4">{exercise.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        📄 {exercise.file_name}
                      </span>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors">
                        Exercice
                      </button>
                    </div>
                    {exercise.correction_name && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          ✅ {exercise.correction_name}
                        </span>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                          Correction
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Plateforme Éducative. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}