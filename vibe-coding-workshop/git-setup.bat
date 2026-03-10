#!/bin/bash
# Git Setup Commands for Vibe Coding Workshop

echo "🚀 Setting up Git for Vibe Coding Workshop"

# Navigate to your project directory
cd "c:\YEAR 2024\Downloads\project-bolt-sb1-4qtz4c61\vibe-coding-workshop"

# Initialize Git repository
echo "📁 Initializing Git repository..."
git init

# Add all files
echo "📋 Adding all files..."
git add .

# Initial commit
echo "💾 Making initial commit..."
git commit -m "Initial commit: Complete Vibe Coding Workshop implementation

- All 4 UCs implemented (UC-0A, UC-0B, UC-0C, UC-X)
- Complete documentation and README files
- Test data for all scenarios
- Setup validation script
- PR template for submissions"

# Add remote repository
echo "🔗 Adding remote repository..."
echo "Replace 'YOUR_USERNAME' with your actual GitHub username"
git remote add origin https://github.com/YOUR_USERNAME/vibe-coding-workshop.git

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

echo "✅ Setup complete! Your repository is now on GitHub!"
