# FROM node:16-alpine3.15 as build
# WORKDIR /app
# COPY package.json ./
# RUN npm install --force
# COPY . .
# EXPOSE 4200
# CMD npm run start

#### Étape 1 : Construire l'application Angular
FROM node:18 as build


# Configuration du répertoire de travail principal à l'intérieur de l'image Docker.
# C'est le répertoire de base utilisé pour les commandes RUN, COPY et ENTRYPOINT suivantes.
WORKDIR /app

# Copier package.json ainsi que package-lock.json et installer les dépendances.
# Ceci est une étape distincte pour que les dépendances soient mises en cache à moins que des changements
# ne soient effectués sur l'un de ces deux fichiers.
COPY package*.json ./
RUN npm install --force


# Copier l'application principale
COPY . ./


# Arguments
ARG configuration=production


# Construire l'application
RUN npm run build -- --output-path=./dist/out --configuration $configuration


#### Étape 2 : Utiliser l'application compilée, prête pour la production avec Nginx
FROM nginx

# Copier la construction d'Angular depuis l'Étape 1
COPY --from=build /app/dist/out /usr/share/nginx/html

# Copier notre configuration personnalisée de Nginx
COPY /nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 6300 à l'hôte Docker, afin que nous puissions y accéder depuis l'extérieur.
EXPOSE 6400

#ENTRYPOINT ["nginx","-g","daemon off;"]
