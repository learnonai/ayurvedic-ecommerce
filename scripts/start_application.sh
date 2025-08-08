#!/bin/bash
cd /home/ec2-user/ayurvedic-ecommerce

# Start services
cd backend
pm2 start server.js --name "api"

cd ../admin-panel
pm2 serve build 3000 --name "admin"

cd ../client-website
pm2 serve build 3001 --name "client"

pm2 save