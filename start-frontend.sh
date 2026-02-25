#!/bin/bash
echo "Setting up frontend..."
cp -rf frontend/src/* build-template/src/frontend/src/
cp -f frontend/index.html build-template/src/frontend/
cp -f frontend/index.css build-template/src/frontend/
cp -f frontend/tailwind.config.js build-template/src/frontend/

echo "Navigating to frontend directory..."
cd build-template/src/frontend

echo "Installing node modules..."
npx pnpm@latest install

echo "Starting Vite development server..."
npx pnpm@latest start
