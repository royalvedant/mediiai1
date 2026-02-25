#!/bin/bash
set -e

echo "Setting up frontend for production build..."
mkdir -p build-template/src/frontend/src

cp -rf frontend/src/* build-template/src/frontend/src/ || true
cp -f frontend/index.html build-template/src/frontend/ || true
cp -f frontend/index.css build-template/src/frontend/ || true
cp -f frontend/tailwind.config.js build-template/src/frontend/ || true

echo "Navigating to frontend directory..."
cd build-template/src/frontend

echo "Installing dependencies..."
npm i -g pnpm@latest
pnpm install

echo "Building project..."
npx vite build
