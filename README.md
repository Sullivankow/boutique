# Boutique – maquette e-commerce (React + NestJS + PostgreSQL)

## État du projet — 2 octobre 2026

Fonctionnalités disponibles actuellement :

- Parcourir le catalogue de produits, rechercher par nom et filtrer par catégorie (Maison, Tech, Mode).
- Consulter une fiche produit avec sa description, son prix et son stock.
- Ajouter des produits au panier, ajuster les quantités et retirer des articles. Le panier est conservé dans le navigateur (`localStorage`).
- Créer un compte, se connecter et se déconnecter. Un mot de passe d’au moins 6 caractères est requis à l’inscription.
- Passer une commande en étant connecté. Le serveur vérifie le prix et le stock, puis enregistre la commande.
- Consulter l’historique de ses commandes.

Le paiement est simulé : aucun paiement réel n’est effectué. Cette section décrit l’état actuel et sera actualisée au fil des améliorations.

## Prérequis

Node 18+, Docker (pour PostgreSQL) ou un PostgreSQL local.

## Lancer

```bash
# 1. Base de données
docker compose up -d

# 2. Backend (http://localhost:3000/api)
cd backend && cp .env.example .env && npm install && npm run start:dev

# 3. Frontend (http://localhost:5173) – dans un autre terminal
cd frontend && npm install && npm run dev
```

PostgreSQL est exposé sur `localhost:5433` (le port `5432` était déjà utilisé sur la machine).

Au premier démarrage, 12 produits de démonstration sont insérés automatiquement.

## API

| Méthode | Route                                | Description                                                 |
| ------- | ------------------------------------ | ----------------------------------------------------------- |
| GET     | /api/products?search=&category=      | Liste filtrable                                             |
| GET     | /api/products/:id                    | Détail                                                      |
| POST    | /api/auth/register · /api/auth/login | Inscription / connexion (JWT)                               |
| POST    | /api/orders                          | Passer commande (JWT) – prix et stock vérifiés côté serveur |
| GET     | /api/orders                          | Mes commandes (JWT)                                         |

## Notes

- `synchronize: true` (TypeORM) crée les tables seul : à remplacer par des migrations en production.
- Changez `JWT_SECRET` dans `backend/.env`.
- Frontend : pages chargées à la demande (`React.lazy`), images `loading="lazy"`, panier persisté dans `localStorage`.
