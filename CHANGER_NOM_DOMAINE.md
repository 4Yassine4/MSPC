# 🌐 Changer le Nom de Domaine - Guide

## Option 1 : Changer le Sous-Domaine Vercel (Gratuit ⭐)

### Étape par Étape :

1. **Allez sur votre Dashboard Vercel**
   - Connectez-vous sur https://vercel.com
   - Cliquez sur votre projet déployé

2. **Accédez aux Settings du Projet**
   - Cliquez sur l'onglet **"Settings"** (en haut)
   - Dans le menu de gauche, cliquez sur **"Domains"**

3. **Changer le Domaine Vercel**
   - Vous verrez votre domaine actuel (ex: `mspc-site-xyz.vercel.app`)
   - Cliquez sur **"Edit"** ou **"Change"** à côté du domaine
   - Entrez votre nouveau nom souhaité (ex: `cours-mspc.vercel.app`)
   - Cliquez sur **"Save"** ou **"Add"**
   - Vercel vérifie que le nom est disponible
   - Si disponible, c'est fait ! ✅

### Exemples de noms possibles :
- `cours-mspc.vercel.app`
- `mspc-cours.vercel.app`
- `mspc-education.vercel.app`
- `formation-mspc.vercel.app`

**Règles :**
- ✅ Utilisez uniquement des lettres minuscules, chiffres et tirets (`-`)
- ❌ Pas d'espaces, pas de majuscules
- ✅ Longueur max : 63 caractères

---

## Option 2 : Domaine Personnalisé (Si vous avez un domaine)

Si vous avez acheté un domaine (ex: `monsite.com`, `mspc.fr`), vous pouvez l'utiliser :

### Étape par Étape :

1. **Dans Vercel - Settings > Domains**
   - Cliquez sur **"Add Domain"**
   - Entrez votre domaine (ex: `monsite.com` ou `www.monsite.com`)

2. **Configurer le DNS**
   Vercel vous donnera des instructions pour configurer votre DNS :
   
   **Type A Record :**
   ```
   Type: A
   Name: @ (ou laissez vide)
   Value: 76.76.21.21
   ```
   
   **OU Type CNAME :**
   ```
   Type: CNAME
   Name: www (ou @)
   Value: cname.vercel-dns.com
   ```
   
   Les instructions exactes sont données par Vercel selon votre fournisseur de domaine.

3. **Attendre la Propagation DNS**
   - Cela peut prendre de 5 minutes à 48 heures
   - Vercel vérifie automatiquement et vous notifie quand c'est prêt

### Fournisseurs de Domaines Populaires :
- **Namecheap** : namecheap.com
- **GoDaddy** : godaddy.com
- **OVH** : ovh.com (France)
- **Google Domains** : domains.google
- **Cloudflare** : cloudflare.com

---

## ⚠️ Important Après le Changement

### Si vous utilisez Supabase :

Après avoir changé votre domaine, vous devez mettre à jour Supabase :

1. **Dashboard Supabase** > **Settings** > **API**
2. Dans **"URL Configuration"**, **ajoutez votre nouveau domaine**
3. Exemple : `https://cours-mspc.vercel.app`
4. Cliquez sur **"Save"**

Cela permet à Supabase de reconnaître votre nouveau domaine pour l'authentification.

---

## 🎯 Recommandation

Pour un site éducatif, je recommande :
- **Sous-domaine Vercel gratuit** : `cours-mspc.vercel.app`
- **Court et mémorable**
- **Gratuit et fonctionne immédiatement**

Un domaine personnalisé n'est nécessaire que si vous voulez vraiment `monsite.com` au lieu de `.vercel.app`.

---

## ✅ Résumé Rapide

**Pour changer juste le nom Vercel (gratuit) :**
1. Vercel Dashboard > Votre Projet > Settings > Domains
2. Cliquez "Edit" sur le domaine existant
3. Entrez votre nouveau nom
4. Sauvegardez
5. Mettez à jour Supabase Settings > API avec le nouveau domaine

**C'est tout !** 🎉

