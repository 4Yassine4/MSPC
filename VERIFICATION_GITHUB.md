# 🔍 Vérification du Repository GitHub

## Étape 1 : Vérifier l'URL exacte de votre repository

1. Allez sur **https://github.com** et connectez-vous
2. Trouvez votre repository **MSPC**
3. Cliquez dessus pour l'ouvrir
4. Cliquez sur le bouton vert **"Code"**
5. Copiez l'URL qui s'affiche (elle devrait ressembler à : `https://github.com/VOTRE_USERNAME/MSPC.git`)

## Étape 2 : Vérifier le nom exact

- Nom d'utilisateur GitHub : `4yass4` ou `4Yassine4` ? (attention à la casse)
- Nom du repository : `MSPC` ou `mspc` ou autre chose ?
- Le repository existe-t-il vraiment ? (vérifiez sur votre profil GitHub)

## Solutions selon le problème

### Si le repository n'existe pas encore :
1. Créez-le sur GitHub (bouton "+" > "New repository")
2. Nom : `MSPC`
3. Cochez "Private" si vous voulez le garder privé
4. **Ne cochez PAS** "Initialize with README"

### Si l'URL est incorrecte :
Corrigez l'URL dans Git :
```bash
git remote set-url origin https://github.com/BON_USERNAME/BON_REPO.git
```
(Remplacez BON_USERNAME et BON_REPO par les vraies valeurs)

### Si le repository est privé :
Vous devez vous authentifier. Deux options :

**Option A : Utiliser un token (Recommandé)**
1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token (classic)
3. Cochez "repo"
4. Copiez le token
5. Utilisez : `git remote set-url origin https://TOKEN@github.com/4yass4/MSPC.git`

**Option B : Utiliser SSH**
```bash
git remote set-url origin git@github.com:4yass4/MSPC.git
```

