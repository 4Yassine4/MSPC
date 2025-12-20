# 🔧 Configurer les DNS pour Vercel - Guide

Vercel vous demande de configurer un enregistrement DNS de type **A** avec la valeur `216.198.79.1` pour votre domaine `mspctech.com`.

## 📋 Ce que vous devez faire

1. Aller chez votre fournisseur de domaine (là où vous avez acheté `mspctech.com`)
2. Accéder aux paramètres DNS
3. Ajouter/modifier un enregistrement de type **A**
4. Attendre la propagation (quelques minutes à quelques heures)

---

## 🎯 Étapes selon votre Fournisseur

### Si c'est OVH (France)

1. **Connectez-vous** sur https://www.ovh.com
2. Allez dans **"Mon compte"** > **"Mes services"** > **"Domaines"**
3. Cliquez sur `mspctech.com`
4. Allez dans l'onglet **"Zone DNS"**
5. Cherchez un enregistrement de type **A** avec le nom `@` (ou `mspctech.com`)
6. **Si il existe déjà :**
   - Cliquez sur **"Modifier"** (icône crayon)
   - Changez la **Cible** par : `216.198.79.1`
   - Cliquez sur **"Valider"**
7. **Si il n'existe pas :**
   - Cliquez sur **"Ajouter une entrée"**
   - Type : `A`
   - Sous-domaine : `@` (ou laissez vide)
   - Cible : `216.198.79.1`
   - Cliquez sur **"Ajouter l'entrée"**

---

### Si c'est GoDaddy

1. **Connectez-vous** sur https://www.godaddy.com
2. Allez dans **"Mes produits"** > Trouvez `mspctech.com` > Cliquez sur **"Gérer"**
3. Allez dans l'onglet **"DNS"** ou **"Gérer les enregistrements DNS"**
4. Cherchez un enregistrement de type **A** avec le nom `@` (ou `mspctech.com`)
5. **Si il existe déjà :**
   - Cliquez sur l'icône **"Crayon"** (modifier)
   - Changez **Points vers** par : `216.198.79.1`
   - Cliquez sur **"Sauvegarder"**
6. **Si il n'existe pas :**
   - Cliquez sur **"Ajouter"**
   - Type : `A`
   - Nom : `@` (ou laissez vide)
   - Valeur : `216.198.79.1`
   - TTL : `600` (ou laissez par défaut)
   - Cliquez sur **"Sauvegarder"**

---

### Si c'est Namecheap

1. **Connectez-vous** sur https://www.namecheap.com
2. Allez dans **"Domain List"** > Cliquez sur **"Manage"** à côté de `mspctech.com`
3. Allez dans l'onglet **"Advanced DNS"**
4. Dans la section **"Host Records"**, cherchez un enregistrement de type **A Record** avec Host `@`
5. **Si il existe déjà :**
   - Cliquez sur l'icône **"Modifier"**
   - Changez **Value** par : `216.198.79.1`
   - Cliquez sur **"Save"** (✓)
6. **Si il n'existe pas :**
   - Cliquez sur **"Add New Record"**
   - Type : `A Record`
   - Host : `@`
   - Value : `216.198.79.1`
   - TTL : `Automatic`
   - Cliquez sur **"Save"** (✓)

---

### Si c'est Cloudflare

1. **Connectez-vous** sur https://www.cloudflare.com
2. Sélectionnez votre domaine `mspctech.com`
3. Allez dans **"DNS"** > **"Records"**
4. Cherchez un enregistrement de type **A** avec le nom `@` (ou `mspctech.com`)
5. **Si il existe déjà :**
   - Cliquez sur l'enregistrement
   - Changez **IPv4 address** par : `216.198.79.1`
   - Cliquez sur **"Save"**
6. **Si il n'existe pas :**
   - Cliquez sur **"Add record"**
   - Type : `A`
   - Name : `@` (ou votre domaine)
   - IPv4 address : `216.198.79.1`
   - Proxy status : **DNS only** (pas de proxy orange)
   - Cliquez sur **"Save"**

---

### Si c'est un autre fournisseur

Cherchez la section **"DNS"**, **"Zone DNS"**, **"Enregistrements DNS"** ou **"Gestion DNS"** et ajoutez/modifiez :

- **Type** : `A`
- **Nom/Host** : `@` (ou laissez vide, ou `mspctech.com`)
- **Valeur/Points vers/IP** : `216.198.79.1`
- **TTL** : Laissez par défaut (généralement 600 ou 3600)

---

## ⏱️ Après avoir configuré

1. **Attendez 5-10 minutes** (la propagation DNS peut prendre du temps)
2. **Retournez sur Vercel**
3. Cliquez sur le bouton **"Rafraîchir"** sur la page de configuration DNS
4. Vercel va vérifier automatiquement si les DNS sont bien configurés

---

## ✅ Vérification

Une fois que c'est bon, vous verrez sur Vercel :
- ✅ **"Configuration Valide"** au lieu de "Configuration Invalide"
- Le domaine sera connecté et votre site sera accessible sur `https://mspctech.com`

---

## 🆘 Si ça ne fonctionne toujours pas après 30 minutes

1. Vérifiez que vous avez bien enregistré les changements DNS
2. Vérifiez qu'il n'y a pas plusieurs enregistrements A pour `@` (supprimez les anciens)
3. Attendez jusqu'à 48h (rare mais possible)
4. Contactez le support de votre fournisseur de domaine si besoin

---

**Astuce** : Vous pouvez vérifier si vos DNS sont propagés en utilisant un outil en ligne comme https://dnschecker.org - Tapez `mspctech.com` et vérifiez que l'IP `216.198.79.1` apparaît.

