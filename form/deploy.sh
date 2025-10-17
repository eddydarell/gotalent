#!/bin/bash

# Deploy script for inscription form app

echo "🚀 Déploiement de l'application d'inscription Go Talent"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker."
    exit 1
fi

echo "📦 Arrêt des services existants..."
docker-compose down

echo "🏗️  Construction des images Docker..."
docker-compose build

echo "🚀 Démarrage des services..."
docker-compose up -d

echo "⏳ Attente du démarrage des services..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services démarrés avec succès !"
    echo ""
    echo "🌐 Applications disponibles :"
    echo "   - Frontend: http://localhost"
    echo "   - API: http://localhost/api"
    echo "   - Adminer: http://localhost:8080"
    echo ""
    echo "📊 Pour voir les logs :"
    echo "   docker-compose logs -f"
else
    echo "❌ Erreur lors du démarrage des services"
    echo "📋 Vérifiez les logs :"
    echo "   docker-compose logs"
    exit 1
fi
