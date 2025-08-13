#!/bin/bash

echo "🔧 FIXING DEPLOYMENT ISSUES"
echo "============================"

# SSH into EC2 and fix issues
ssh -i ~/.ssh/your-key.pem ec2-user@3.91.235.214 << 'EOF'

echo "1. Checking current PM2 status:"
pm2 status

echo -e "\n2. Stopping all PM2 processes:"
pm2 delete all

echo -e "\n3. Starting backend API:"
cd /home/ec2-user/ayurvedic-ecommerce/backend
pm2 start server.js --name "api"

echo -e "\n4. Starting admin panel:"
cd ../admin-panel
pm2 serve build 3000 --name "admin" --spa

echo -e "\n5. Starting client website:"
cd ../client-website  
pm2 serve build 3001 --name "client" --spa

echo -e "\n6. Saving PM2 config:"
pm2 save

echo -e "\n7. Reloading nginx:"
sudo systemctl reload nginx

echo -e "\n8. Final PM2 status:"
pm2 status

echo -e "\n9. Testing local endpoints:"
curl -s http://localhost:5000/api/products | head -5
curl -s http://localhost:3000 | head -5
curl -s http://localhost:3001 | head -5

EOF

echo "✅ Fix deployment completed!"