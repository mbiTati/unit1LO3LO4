# 🚀 Guide de Déploiement — CodeQuest Repo

## 1. Pousser le contenu sur GitHub

### Méthode sécurisée (ne JAMAIS partager le token dans un chat)

```bash
# 1. Cloner le repo existant
git clone https://github.com/mbiTati/unit1LO3LO4.git
cd unit1LO3LO4

# 2. Copier le contenu téléchargé depuis Claude dans ce dossier
# (extraire l'archive unit1LO3LO4_complet.tar.gz ici)

# 3. Ajouter les fichiers
git add .
git commit -m "feat: Module 01 (Conditions) + Module 02 (Boucles) - cours interactifs + exercices"

# 4. Pousser (Git demandera le token comme mot de passe)
git push origin main
# Username : mbiTati
# Password : [coller votre token ici — NE PAS le partager ailleurs]
```

### Alternative : configurer le token une seule fois

```bash
# Stocker le token localement (ne le partage nulle part)
git config --global credential.helper store
git push origin main
# Entrer le token UNE fois, il sera mémorisé
```

---

## 2. Structure des Mini-Jeux (fichiers .jsx)

Les fichiers `.jsx` sont des **composants React** conçus pour fonctionner dans :
- **Claude.ai** (comme artifacts interactifs)
- **Un site web React** (à déployer sur Vercel/Netlify)

### Option A : Utiliser directement dans Claude.ai
1. Ouvrir Claude.ai
2. Copier-coller le contenu du fichier .jsx
3. Claude le rend comme un artifact interactif
4. Les étudiants y accèdent via le lien partagé

### Option B : Déployer un site web
```bash
# Créer un projet React
npx create-react-app codequest-app
cd codequest-app

# Copier les fichiers .jsx dans src/
cp mini-jeux/*.jsx src/

# Dans src/App.js, importer le module voulu :
# import Module01 from './Module01_Conditions';
# export default function App() { return <Module01 />; }

# Lancer
npm start

# Déployer sur Vercel (gratuit)
npx vercel
```

### Option C : GitHub Pages (gratuit, simple)
```bash
npm install gh-pages --save-dev
# Ajouter dans package.json :
# "homepage": "https://mbiTati.github.io/codequest-app"
# "scripts": { "deploy": "gh-pages -d build" }
npm run build
npm run deploy
```

---

## 3. Fichiers Java pour les étudiants

### Comment distribuer les exercices

Les fichiers `.java` dans `phase1-rattrapage/` sont des **starter codes** à ouvrir dans Eclipse.

**Pour l'étudiant :**
1. Ouvrir Eclipse
2. File → New → Java Project → nom : `CodeQuest`
3. Copier le fichier `.java` dans le dossier `src/` du projet
4. Ou : clic droit sur `src` → Import → File System → sélectionner le .java
5. Compléter les TODO
6. Exécuter avec Ctrl+F11

**Les fichiers `_CORRECTION.java` sont pour l'enseignant uniquement.**

Vous pouvez les mettre dans un dossier séparé ou un repo privé.

---

## 4. Structure finale du repo

```
unit1LO3LO4/
├── README.md                          # Ce fichier
├── docs/
│   └── GUIDE_DEPLOIEMENT.md          # Ce guide
│
├── mini-jeux/                         # Cours interactifs (React)
│   ├── Module01_Conditions.jsx        # if/else, switch, &&, ||
│   ├── Module02_Boucles.jsx           # for, while, do-while
│   ├── Module03_OOP.jsx               # Classes, constructeur, getter/setter
│   └── ...
│
├── phase1-rattrapage/
│   ├── 01-basiques-conditions/
│   │   ├── Distributeur.java          # Starter code (étudiant)
│   │   ├── Distributeur_CORRECTION.java  # Correction (enseignant)
│   │   └── MEMO_Conditions.md         # Fiche mémo
│   ├── 02-boucles/
│   │   ├── LaboStats.java             # Starter code
│   │   └── LaboStats_CORRECTION.java  # Correction
│   ├── 03-oop-fondamentaux/
│   │   └── ...
│   └── 04-manipulation-data/
│       └── ...
│
├── phase2-LO3/
│   └── ...
│
├── phase3-LO4/
│   └── ...
│
└── projet-salon/
    └── ...
```

---

## 5. Créer un token GitHub sécurisé

1. Aller sur GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Cliquer "Generate new token"
3. Nom : `codequest-push`
4. Expiration : 30 jours
5. Repository access : Only select repositories → `unit1LO3LO4`
6. Permissions : Contents (Read and write)
7. Generate token
8. **Copier le token et le coller UNIQUEMENT dans votre terminal**
9. **NE JAMAIS le coller dans un chat, email, ou document partagé**

---

*CodeQuest — Le Labo de l'Inventeur*
