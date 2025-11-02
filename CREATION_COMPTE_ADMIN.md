# 🔐 Création du Compte Administrateur

Ce guide explique comment créer le compte administrateur unique pour l'application Cours MSPC.

## 📋 Prérequis

- Un projet Supabase configuré (voir `SUPABASE_SETUP.md`)
- Les variables d'environnement configurées dans `.env.local`

## 🎯 Méthode 1 : Via l'Interface Supabase (Recommandé)

### Étape 1 : Aller dans Authentication

1. Connectez-vous à votre dashboard Supabase
2. Cliquez sur **Authentication** dans le menu de gauche
3. Cliquez sur **Users** dans le sous-menu

### Étape 2 : Créer l'utilisateur

1. Cliquez sur le bouton **"Add user"** ou **"Invite user"**
2. Sélectionnez **"Create new user"**
3. Remplissez les informations :
   - **Email** : L'email que vous voulez utiliser pour vous connecter (ex: `admin@mspc.fr`)
   - **Password** : Un mot de passe fort (minimum 8 caractères)
   - **Auto Confirm User** : ✅ **Cochez cette case** (important !)
4. Cliquez sur **"Create user"**

### Étape 3 : Vérifier la création

Vous devriez voir votre utilisateur dans la liste avec l'email que vous avez fourni.

---

## 🛠️ Méthode 2 : Via SQL (Alternative)

Si vous préférez créer l'utilisateur via SQL :

1. Allez dans **SQL Editor** dans Supabase
2. Créez un nouveau script
3. Exécutez cette commande SQL :

```sql
-- Remplacez 'admin@mspc.fr' et 'VotreMotDePasseSecurise123!' par vos valeurs
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@mspc.fr',  -- Remplacez par votre email
  crypt('VotreMotDePasseSecurise123!', gen_salt('bf')),  -- Remplacez par votre mot de passe
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Récupérer l'ID de l'utilisateur créé
SELECT id, email FROM auth.users WHERE email = 'admin@mspc.fr';
```

**Note** : Cette méthode est plus complexe. La méthode 1 via l'interface est recommandée.

---

## 🔒 Sécurité

### Bonnes pratiques pour le mot de passe :

- ✅ Minimum 12 caractères
- ✅ Utilisez des majuscules, minuscules, chiffres et caractères spéciaux
- ✅ Ne partagez jamais ce mot de passe
- ✅ Changez-le régulièrement

### Exemple de mot de passe fort :
```
MSPC-Admin2024!Secure
```

---

## ✅ Vérification

Une fois le compte créé, testez la connexion :

1. Allez sur `http://localhost:3000/login`
2. Entrez l'email que vous avez configuré
3. Entrez le mot de passe
4. Vous devriez être redirigé vers `/admin`

---

## 🚨 Important

- **Un seul compte admin** : Ce système est conçu pour avoir un seul compte administrateur
- **Pas d'inscription publique** : Les utilisateurs ne peuvent pas créer de comptes
- **Supabase Auth désactive l'inscription par défaut** : C'est parfait pour notre cas d'usage

---

## 🔧 Désactiver l'inscription publique (Optionnel)

Pour être sûr que personne ne peut créer de compte :

1. Allez dans **Authentication** > **Settings**
2. Trouvez **"Enable email signup"**
3. **Désactivez-le** (toggle OFF)
4. Cliquez sur **"Save"**

Maintenant, seuls les utilisateurs créés manuellement (comme votre compte admin) pourront se connecter.

---

## 📝 Résumé

1. ✅ Créez un utilisateur via l'interface Supabase avec **Auto Confirm** activé
2. ✅ Utilisez un mot de passe fort
3. ✅ Testez la connexion
4. ✅ (Optionnel) Désactivez l'inscription publique

Votre système d'authentification sécurisé est maintenant prêt ! 🔐

