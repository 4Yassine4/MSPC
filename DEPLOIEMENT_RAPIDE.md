# 🚀 Déploiement Rapide - En 3 Étapes

## ⚡ Méthode Ultra-Rapide (15 minutes)

### 1️⃣ GitHub (5 min)
1. Créez un compte sur https://github.com
2. Créez un nouveau repository (nom : `mspc-site`, cochez "Private")
3. Dans PowerShell, exécutez :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/mspc-site.git
git push -u origin main
```

👉 **Remplacez `VOTRE_USERNAME` par votre nom GitHub !**

---

### 2️⃣ Vercel (5 min)
1. Allez sur https://vercel.com
2. "Sign Up" avec GitHub
3. Cliquez "Add New Project"
4. Importez votre repo `mspc-site`
5. **AJOUTEZ LES VARIABLES D'ENVIRONNEMENT :**
   - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé Supabase
6. Cliquez "Deploy"

---

### 3️⃣ Supabase (5 min)
1. Dashboard Supabase > Settings > API
2. Ajoutez votre URL Vercel dans "URL Configuration"
   - Exemple : `https://mspc-site.vercel.app`
3. Sauvegardez

---

## ✅ C'est Fait !

Votre site est en ligne ! Partagez l'URL Vercel avec vos étudiants.

**Besoin d'aide ?** Consultez `GUIDE_DEPLOIEMENT.md` pour plus de détails.

