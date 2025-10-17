#!/bin/bash

# Development startup script

echo "🚀 Démarrage de l'environnement de développement"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Check if Deno is installed
if ! command -v deno &> /dev/null; then
    echo "❌ Deno n'est pas installé. Veuillez l'installer d'abord."
    echo "   Installation: curl -fsSL https://deno.land/install.sh | sh"
    exit 1
fi

echo "📦 Installation des dépendances frontend..."
npm install

echo "🗄️  Initialisation de la base de données..."
cd server
deno task migrate

echo "🚀 Démarrage du serveur backend..."
deno task dev &
BACKEND_PID=$!

echo "⏳ Attente du démarrage du backend..."
sleep 3

echo "🌐 Démarrage du serveur frontend..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "✅ Environnement de développement démarré !"
echo ""
echo "🌐 Applications disponibles :"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Arrêt des services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for any process to exit
wait
