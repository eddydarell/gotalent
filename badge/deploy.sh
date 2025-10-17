#!/bin/bash

# Go Talent PWA Deployment Script
# This script helps deploy the PWA to various platforms

echo "🚀 Go Talent PWA Deployment Script"
echo "=================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "📦 Deploying to Vercel..."
    if command_exists vercel; then
        vercel --prod
        echo "✅ Deployed to Vercel successfully!"
    else
        echo "❌ Vercel CLI not found. Install with: npm i -g vercel"
        echo "💡 Or deploy manually at https://vercel.com/new"
    fi
}

# Function to deploy to Netlify
deploy_netlify() {
    echo "📦 Deploying to Netlify..."
    if command_exists netlify; then
        netlify deploy --prod --dir .
        echo "✅ Deployed to Netlify successfully!"
    else
        echo "❌ Netlify CLI not found. Install with: npm i -g netlify-cli"
        echo "💡 Or deploy manually at https://app.netlify.com/drop"
    fi
}

# Function to prepare for GitHub Pages
prepare_github_pages() {
    echo "📦 Preparing for GitHub Pages..."
    
    if [ ! -d ".git" ]; then
        echo "🔧 Initializing Git repository..."
        git init
        git add .
        git commit -m "Initial commit: Go Talent PWA"
        echo "📝 Repository initialized. Next steps:"
        echo "   1. Create a repository on GitHub"
        echo "   2. git remote add origin https://github.com/yourusername/gotalent-pwa.git"
        echo "   3. git push -u origin main"
        echo "   4. Enable GitHub Pages in repository settings"
    else
        echo "✅ Git repository already exists"
        echo "📝 To deploy:"
        echo "   1. git add ."
        echo "   2. git commit -m 'Update PWA'"
        echo "   3. git push origin main"
    fi
}

# Function to start local development server
start_dev_server() {
    echo "🖥️  Starting local development server..."
    
    if command_exists python3; then
        echo "🐍 Using Python 3..."
        python3 -m http.server 8000
    elif command_exists python; then
        echo "🐍 Using Python 2..."
        python -m SimpleHTTPServer 8000
    elif command_exists node; then
        if command_exists http-server; then
            echo "📦 Using http-server..."
            http-server -p 8000
        else
            echo "❌ http-server not found. Install with: npm i -g http-server"
            exit 1
        fi
    else
        echo "❌ No suitable web server found. Please install Python or Node.js"
        exit 1
    fi
}

# Function to validate PWA
validate_pwa() {
    echo "🔍 Validating PWA structure..."
    
    # Check required files
    required_files=("index.html" "manifest.json" "sw.js" "js/app.js" "data/participants.json")
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            echo "✅ $file"
        else
            echo "❌ $file (missing)"
        fi
    done
    
    # Check icons directory
    if [ -d "icons" ]; then
        icon_count=$(ls icons/ | wc -l)
        echo "✅ icons/ directory ($icon_count files)"
    else
        echo "❌ icons/ directory (missing)"
    fi
    
    echo ""
    echo "💡 Recommendations:"
    echo "   - Test on mobile devices"
    echo "   - Verify offline functionality"
    echo "   - Check PWA audit in Chrome DevTools"
}

# Main menu
echo ""
echo "Select deployment option:"
echo "1) Start local development server"
echo "2) Validate PWA structure"
echo "3) Deploy to Vercel"
echo "4) Deploy to Netlify"
echo "5) Prepare for GitHub Pages"
echo "6) Exit"

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        start_dev_server
        ;;
    2)
        validate_pwa
        ;;
    3)
        deploy_vercel
        ;;
    4)
        deploy_netlify
        ;;
    5)
        prepare_github_pages
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please select 1-6."
        exit 1
        ;;
esac
