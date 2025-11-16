#!/bin/bash

# MediGo - GitHub Repository Setup Script
# This script helps you set up a new GitHub repository

echo "🚀 MediGo - GitHub Repository Setup"
echo "===================================="
echo ""

# Step 1: Remove old remote (if exists)
echo "Step 1: Removing old remote..."
git remote remove origin 2>/dev/null || echo "No old remote found (that's okay)"
echo "✅ Old remote removed"
echo ""

# Step 2: Instructions for creating GitHub repo
echo "Step 2: Create GitHub Repository"
echo "---------------------------------"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: MediGo"
echo "3. Description: AI-powered medical appointment booking platform"
echo "4. Choose Public or Private"
echo "5. DO NOT initialize with README, .gitignore, or license"
echo "6. Click 'Create repository'"
echo ""
read -p "Press Enter after you've created the repository on GitHub..."

# Step 3: Get GitHub username
echo ""
echo "Step 3: Add Remote Repository"
echo "-----------------------------"
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Username cannot be empty!"
    exit 1
fi

# Step 4: Add new remote
echo ""
echo "Adding remote repository..."
git remote add origin https://github.com/${GITHUB_USERNAME}/MediGo.git

if [ $? -eq 0 ]; then
    echo "✅ Remote added successfully"
else
    echo "❌ Failed to add remote. It might already exist."
    echo "Trying to update existing remote..."
    git remote set-url origin https://github.com/${GITHUB_USERNAME}/MediGo.git
fi

# Step 5: Push to GitHub
echo ""
echo "Step 4: Pushing to GitHub"
echo "-------------------------"
echo "Pushing code to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your code has been pushed to GitHub!"
    echo "📍 Repository URL: https://github.com/${GITHUB_USERNAME}/MediGo"
    echo ""
    echo "Next steps:"
    echo "1. Check your repository on GitHub"
    echo "2. Follow DEPLOYMENT_GUIDE.md for deployment instructions"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. Repository exists on GitHub"
    echo "2. You have write access"
    echo "3. GitHub credentials are configured"
fi

