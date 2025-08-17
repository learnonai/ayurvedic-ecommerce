#!/bin/bash

echo "🚀 Quick Deploy to EC2..."

# Push to GitHub first
git push origin main

# SSH into EC2 and deploy directly
ssh -i ~/.ssh/your-key.pem ec2-user@3.91.235.214 << 'EOF'
cd /home/ec2-user/ayurvedic-ecommerce
echo "📥 Pulling latest changes..."
git pull origin main

echo "🛑 Stopping services..."
pm2 delete all 2>/dev/null || true

echo "🖼️ Setting up images..."
mkdir -p backend/uploads
cp backend/sample-images/* backend/uploads/ 2>/dev/null || echo "No sample images"

echo "📦 Installing backend dependencies..."
cd backend && npm install

echo "🔧 Starting backend..."
pm2 start server.js --name "api"

echo "📦 Building client..."
cd ../client-website && npm install && npm run build

echo "🌐 Starting client..."
pm2 serve build 3001 --name "client" --spa

echo "⚙️ Reloading nginx..."
sudo systemctl reload nginx

pm2 save
echo "✅ Deployment complete!"
pm2 status
EOF

echo "🎉 Quick deployment finished!"