# 🚀 Guide de Déploiement Gratuit - Cours MSPC

Ce guide vous explique comment mettre votre site en ligne gratuitement pour que tout le monde y ait accès.

## 📋 Options Gratuites Disponibles

### Option 1 : Vercel (⭐ Recommandé - Créé par les makers de Next.js)
- ✅ **100% gratuit** pour usage personnel/éducatif
- ✅ **Déploiement automatique** depuis GitHub
- ✅ **Domaine gratuit** (votresite.vercel.app)
- ✅ **Optimisé pour Next.js**
- ✅ **SSL automatique** (HTTPS)
- ✅ **Rapide et fiable**

### Option 2 : Netlify
- ✅ Gratuit
- ✅ Facile à configurer
- ✅ Domaine gratuit

### Option 3 : Railway / Render
- ✅ Gratuit avec limitations
- ⚠️ Un peu plus complexe

---

## 🎯 Option Recommandée : Vercel (Étape par Étape)

### Étape 1 : Préparer le Code (5 minutes)

#### 1.1 Créer un compte GitHub (si vous n'en avez pas)
1. Allez sur https://github.com
2. Créez un compte gratuit
3. Connectez-vous

#### 1.2 Créer un nouveau repository GitHub
1. Cliquez sur le "+" en haut à droite > "New repository"
2. Nom : `mspc-site` (ou autre nom)
3. Description : "Plateforme éducative MSPC"
4. **Cochez "Private"** (pour garder votre code privé)
5. **Ne cochez PAS** "Initialize with README"
6. Cliquez sur "Create repository"

#### 1.3 Préparer le fichier .gitignore (important!)
Créez ou vérifiez que vous avez un fichier `.gitignore` à la racine :

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files (IMPORTANT - ne pas partager vos clés!)
.env*.local
.env

# Vercel
.vercel

# Typescript
*.tsbuildinfo
next-env.d.ts
```

#### 1.4 Préparer le fichier vercel.json (optionnel mais recommandé)
Créez un fichier `vercel.json` à la racine :

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["cdg1"]
}
```

---

### Étape 2 : Pousser le Code sur GitHub (5 minutes)

Ouvrez PowerShell ou Terminal dans le dossier de votre projet et exécutez :

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Cours MSPC"

# Renommer la branche principale
git branch -M main

# Ajouter votre repository GitHub (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/mspc-site.git

# Pousser le code
git push -u origin main
```

**Note :** Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub réel.

---

### Étape 3 : Configurer Vercel (10 minutes)

#### 3.1 Créer un compte Vercel
1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"** (le plus simple)
4. Autorisez l'accès à GitHub

#### 3.2 Déployer le Projet
1. Dans le dashboard Vercel, cliquez sur **"Add New..."** > **"Project"**
2. Importez votre repository `mspc-site`
3. Vercel détecte automatiquement Next.js
4. **IMPORTANT : Ajoutez les variables d'environnement**
   - Cliquez sur **"Environment Variables"**
   - Ajoutez ces 2 variables :
     ```
     NEXT_PUBLIC_SUPABASE_URL = votre_url_supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY = votre_cle_supabase
     ```
   - Cliquez sur "Add" pour chaque variable
5. Cliquez sur **"Deploy"**

#### 3.3 Attendre le Déploiement
- Vercel va :
  - Installer les dépendances
  - Builder votre projet
  - Le mettre en ligne
- Ça prend environ 2-5 minutes

#### 3.4 Votre Site est en Ligne ! 🎉
- Vercel vous donne une URL gratuite : `https://mspc-site.vercel.app` (ou similaire)
- **Votre site est maintenant accessible partout dans le monde !**

---

## 🔒 Configuration Supabase en Production

### Important : Configurer les URL autorisées dans Supabase

Une fois déployé, vous devez dire à Supabase que votre site Vercel est autorisé :

1. Allez dans votre **Supabase Dashboard**
2. **Settings** > **API**
3. Dans **"URL Configuration"**, ajoutez votre URL Vercel :
   - Exemple : `https://mspc-site.vercel.app`
4. Ajoutez aussi :
   - `https://mspc-site.vercel.app/**` (pour les callbacks)
5. Cliquez sur **"Save"**

---

## 📝 Mise à Jour du Site

### Chaque fois que vous modifiez le code :

1. **Committez vos changements :**
   ```bash
   git add .
   git commit -m "Description des changements"
   git push
   ```

2. **Vercel déploie automatiquement !**
   - Dès que vous poussez sur GitHub, Vercel redéploie automatiquement
   - Votre site est mis à jour en 2-3 minutes

---

## 🎨 Personnaliser le Nom de Domaine

### Option 1 : Sous-domaine Vercel (Gratuit)
- Votre site : `mspc-site.vercel.app`
- Vous pouvez le changer dans les settings Vercel

### Option 2 : Domaine Personnalisé (Optionnel)
- Si vous avez un domaine (ex: `monsite.com`)
- Dans Vercel : Settings > Domains
- Ajoutez votre domaine
- Suivez les instructions DNS

---

## ✅ Checklist Avant de Déployer

- [ ] Code poussé sur GitHub
- [ ] Fichier `.gitignore` créé (pour ne pas partager `.env.local`)
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Supabase configuré (tables créées, compte admin créé)
- [ ] URL Vercel ajoutée dans Supabase Settings > API
- [ ] Testé en local que tout fonctionne

---

## 🐛 Problèmes Courants

### Erreur : "Build Failed"
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez les variables d'environnement dans Vercel

### Erreur : "Supabase not configured"
- Vérifiez que les variables d'environnement sont bien dans Vercel
- Vérifiez que l'URL Vercel est autorisée dans Supabase

### Le site fonctionne mais pas l'authentification
- Vérifiez que l'URL de votre site Vercel est dans Supabase Settings > API > URL Configuration

---

## 🎉 C'est Fait !

Une fois déployé :
- ✅ Votre site est accessible 24/7
- ✅ Tout le monde peut y accéder
- ✅ Les mises à jour sont automatiques
- ✅ HTTPS est activé automatiquement
- ✅ C'est totalement gratuit !

**Votre URL sera quelque chose comme :**
`https://mspc-site-xyz.vercel.app`

Partagez cette URL avec vos étudiants ! 📚

---

## 📚 Ressources Utiles

- **Vercel Docs** : https://vercel.com/docs
- **GitHub Docs** : https://docs.github.com
- **Supabase Docs** : https://supabase.com/docs

