# 🚀 QUICK DEPLOYMENT COMMANDS

## For immediate deployment after code changes:

### 1. SSH into EC2 and run this ONE command:
```bash
cd /home/ec2-user/ayurvedic-ecommerce && git pull origin main && pm2 delete all && mkdir -p backend/uploads && cp backend/sample-images/* backend/uploads/ && cd backend && npm install && pm2 start server.js --name "api" && cd ../client-website && npm install && npm run build && pm2 serve build 3001 --name "client" --spa && sudo systemctl reload nginx && pm2 save && pm2 status
```

### 2. Or step by step:
```bash
# SSH into EC2
ssh ec2-user@3.91.235.214

# Run deployment
cd /home/ec2-user/ayurvedic-ecommerce
git pull origin main
pm2 delete all
mkdir -p backend/uploads
cp backend/sample-images/* backend/uploads/
cd backend && npm install && pm2 start server.js --name "api"
cd ../client-website && npm install && npm run build && pm2 serve build 3001 --name "client" --spa
sudo systemctl reload nginx
pm2 save
pm2 status
```

### 3. Check if everything is running:
```bash
pm2 status
curl http://localhost:5000/
curl http://localhost:3001/
```

## 🎯 This deploys in ~2-3 minutes instead of waiting for GitHub Actions!