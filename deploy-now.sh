#!/bin/bash

echo "🚀 Deploying to EC2 now..."

# First push to git
git add . && git commit -m "Quick deploy: $(date)" && git push origin main

# Deploy directly to EC2
curl -X POST "http://3.91.235.214:5000/deploy" || echo "Direct deploy endpoint not available"

# Alternative: Use webhook to trigger immediate deployment
echo "📡 Triggering deployment on EC2..."

# Create a simple deployment trigger
cat > deploy-trigger.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
cd /home/ec2-user/ayurvedic-ecommerce
git pull origin main
pm2 delete all 2>/dev/null || true
mkdir -p backend/uploads
cp backend/sample-images/* backend/uploads/ 2>/dev/null
cd backend && npm install && pm2 start server.js --name "api"
cd ../client-website && npm install && npm run build && pm2 serve build 3001 --name "client" --spa
sudo systemctl reload nginx
pm2 save
DEPLOY_SCRIPT

echo "✅ Use this command to deploy on EC2:"
echo "scp deploy-trigger.sh ec2-user@3.91.235.214:~ && ssh ec2-user@3.91.235.214 'chmod +x deploy-trigger.sh && ./deploy-trigger.sh'"