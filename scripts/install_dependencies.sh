#!/bin/bash
cd /home/ec2-user/ayurvedic-ecommerce

# Install PM2 globally if not installed
npm install -g pm2 || true

# Backend
cd backend
npm install --production
mkdir -p uploads data

# Admin Panel
cd ../admin-panel
npm install --production
npm run build

# Client Website
cd ../client-website
npm install --production
npm run build