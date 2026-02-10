# Test Technique Vue.js - Gestion de Candidatures

Ce projet est développée avec **Vue 3**, **TypeScript**, **VUE ROUTER**, **Vite** et **Tailwind CSS**, utilisant **JSON Server** pour simuler une API backend.

## Fonctionnalités Implémentées

### 1. Gestion des Candidatures

- **Liste des candidatures** : Affichage sous forme de cartes avec informations clés (Nom, Poste, Statut, Téléphone, Email, Date de candidature, lettre de motivation).
- **Détails** : Vue détaillée d'une candidature dans une modale (via bouton "Voir profil") affichant toutes les informations de la candidature.
- **Suppression** : Possibilité de supprimer une candidature.

### 2. Recherche et Filtres Avancés

L'interface permet de filtrer les résultats selon plusieurs critères :

- **Recherche textuelle** : Recherche par nom ou mot-clé.
- **Filtre par Statut** : (En attente, Entretien RH, etc.)
- **Filtre par Compétence** : (Vue.js, React, Node.js, etc.)

### 3. Qualité du Code

- **Linting & Formatage** : Configuration complète avec **ESLint 9** (Flat Config) et **Prettier**. -** architecture modulaire et composants réutilisables** : separation des concerns avec des composants UI et des composables.
- **TypeScript Strict** : Typage rigoureux des props, des réponses API et des données.

---

## 🛠️ Choix Techniques et Résolution de Problèmes

### Gestion de l'API avec JSON Server (v1 Beta)

Le projet utilise la version `v1.0.0-beta` de `json-server`. Cette version présente des différences de comportement par rapport à la v0.17, notamment sur le routage et le filtrage.

j'ai choisi de ne pas utiliser pinia ni vuex pour state management car le projet est de petite taille et les données sont locales et de gangner du temps .

**Problèmes rencontrés et solutions :**

1.  **Recherche textuelle (`q`) limitée** :
    - _Problème_ : Le paramètre `q` de l'API ne retournait pas toujours les résultats attendus avec la structure de données actuelle.
    - _Solution_ : Implémentation d'un filtrage côté client pour la recherche textuelle et le filtre par compétences, assurant une expérience utilisateur fluide et correcte.
2.  **premier fois que j'utilise vue3** :
    -j'ai pris le temps de lire la documentation officielle pour comprendre vue lifecycle (mount(), unmount(), watch(), computed(), ...)

### Architecture

- **Composables** : Utilisation de `useCandidatures` pour encapsuler la logique métie et les appels API, gardant les composants Vue propres.
- **Composants UI** : Création de composants réutilisables (`Select`, `Button`, `Modal`, `Card`) pour maintenir une cohérence visuelle lordment inspiré par shadcn ui.

merci pour cette opportunité
