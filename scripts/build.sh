#!/bin/bash

# Build script for Timely Store
echo "🚀 Building Timely Store..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type checking
echo "🔍 Running type checking..."
npm run typecheck

# Run linting
echo "🧹 Running linting..."
npm run lint

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"
echo "🎉 Your project is ready for deployment!"


