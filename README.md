# 🎓 Plateforme Éducative MSPC

Plateforme éducative moderne pour la gestion de ressources pédagogiques avec 9 chapitres organisés.

## 🚀 Fonctionnalités

- ✅ 9 chapitres organisés avec ressources par type (TP, Synthèse, Exercice, Ressource, Correction)
- ✅ Gestion des ressources par le professeur (ajout, modification, suppression)
- ✅ Système de demande d'accès aux corrections avec approbation
- ✅ Téléchargement des fichiers
- ✅ Interface moderne et responsive
- ✅ Support Supabase (backend) ou localStorage (démo)

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd mspc-site
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Supabase (optionnel mais recommandé)**

   Pour utiliser Supabase comme backend :
   - Créez un compte sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet
   - Suivez les instructions dans `SUPABASE_SETUP.md`
   - Créez le fichier `.env.local` :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
   ```

   **Note** : Si Supabase n'est pas configuré, l'application utilisera localStorage automatiquement.

4. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📚 Les 9 chapitres

1. Électricité et électrotechnique
2. Les composants électriques
3. Les composants pneumatiques
4. Les composants hydrauliques
5. Les automatismes
6. La fabrication
7. La mécanique
8. Les méthodes de gestion et qualité
9. Sécurité professionnelle, hygiène, environnement

## 👨‍🏫 Accès Administration

- URL: `/admin` (accès direct, sans authentification)
- Permet de gérer toutes les ressources et demandes d'accès

## 📖 Utilisation

### Pour les étudiants :
1. Entrez votre email en haut à droite
2. Parcourez les chapitres et leurs ressources
3. Téléchargez les ressources disponibles
4. Demandez l'accès aux corrections si nécessaire

### Pour les professeurs :
1. Cliquez sur "👨‍🏫 Administration" en haut à droite de la page d'accueil
2. Accédez directement à l'interface admin (`/admin`)
3. Ajoutez des ressources en sélectionnant le chapitre et le type
4. Uploadez les fichiers (si Supabase configuré)
5. Gérez les demandes d'accès aux corrections

## 🔧 Configuration

### Avec Supabase (Production)
- Données persistantes dans une base de données
- Stockage de fichiers dans Supabase Storage
- Synchronisation en temps réel
- Voir `SUPABASE_SETUP.md` pour les détails

### Sans Supabase (Démo)
- Utilise localStorage du navigateur
- Les données sont locales au navigateur
- Les fichiers ne sont pas réellement stockés
- Utile pour tester rapidement

## 📁 Structure du projet

```
mspc-site/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Page d'accueil (étudiants)
│   │   ├── admin/
│   │   │   └── page.tsx      # Interface admin
│   └── lib/
│       ├── supabase.ts       # Configuration Supabase
│       └── storage.ts        # Couche d'abstraction (Supabase/localStorage)
├── SUPABASE_SETUP.md         # Guide de configuration Supabase
└── package.json
```

## 🎨 Technologies utilisées

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **Supabase** - Backend et stockage (optionnel)

## 📝 Notes importantes

- Les ressources sont organisées par chapitre et par type
- Les corrections nécessitent une demande d'accès approuvée
- Le téléchargement fonctionne avec les URLs Supabase si configuré
- En mode localStorage, les données persistent même après déconnexion (normal)

## 🐛 Dépannage

Si les ressources disparaissent :
- Vérifiez que Supabase est correctement configuré
- Vérifiez la console pour les erreurs
- En mode localStorage, vérifiez que le navigateur n'a pas nettoyé les données

## 📄 Licence

Projet éducatif - Usage interne
