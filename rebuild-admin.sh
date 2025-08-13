#!/bin/bash

echo "🔧 Rebuilding Admin Panel..."

# SSH into EC2 and rebuild admin
ssh -i ~/.ssh/your-key.pem ec2-user@3.91.235.214 << 'EOF'

cd /home/ec2-user/ayurvedic-ecommerce

# Pull latest code
git pull origin main

# Rebuild admin panel
cd admin-panel
npm install
npm run build

# Restart admin service
pm2 delete admin
pm2 serve build 3000 --name "admin" --spa
pm2 save

echo "✅ Admin panel rebuilt and restarted!"

EOF