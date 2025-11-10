@echo off
echo 🚀 Building Timely Store...

echo 📦 Installing dependencies...
npm install

echo 🔍 Running type checking...
npm run typecheck

echo 🧹 Running linting...
npm run lint

echo 🏗️ Building project...
npm run build

echo ✅ Build completed successfully!
echo 🎉 Your project is ready for deployment!
pause


