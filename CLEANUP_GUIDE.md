# 🧹 PROJECT CLEANUP GUIDE

## ✅ KEEP THESE FILES (ESSENTIAL)

### Core Application Files
- `backend/` - Backend API server (KEEP)
- `admin-panel/` - Admin dashboard (KEEP)
- `client-website/` - Customer website (KEEP)
- `.github/workflows/` - GitHub Actions CI/CD (KEEP)
- `README.md` - Main documentation (KEEP)
- `.gitignore` - Git ignore rules (KEEP)
- `nginx.conf` - Production nginx config (KEEP)

### Essential Scripts
- `start-all.sh` - Start all services locally (KEEP)
- `scripts/deploy.sh` - Main deployment script (KEEP)
- `scripts/start_application.sh` - EC2 startup script (KEEP)

### Configuration Files
- `appspec.yml` - AWS CodeDeploy config (KEEP)
- `QUICK_DEPLOY.md` - Quick deployment instructions (KEEP)

## 🗑️ SAFE TO DELETE

### Duplicate/Redundant Scripts
```bash
rm debug-admin.sh
rm debug-deployment.sh
rm fix-admin.sh
rm fix-deployment.sh
rm fix-ec2.sh
rm fix-nginx.sh
rm fix-ports.sh
rm rebuild-admin.sh
rm restore-working-state.sh
rm check-services.sh
rm deploy-now.sh
rm quick-deploy.sh
rm setup-sample-images.sh
```

### Duplicate Documentation
```bash
rm DATABASE_MIGRATION.md
rm DEPLOYMENT_CHECKLIST.md
rm DEPLOYMENT_GUIDE.md
rm LOCAL_DEV_GUIDE.md
rm PRODUCTION_FIX.md
rm Mannual-Ec2-Start.txt
rm ec2-refresh-deploy.txt
```

### Backup/Temporary Files
```bash
rm .gitignore.bak
rm nginx-production.conf
rm start-local.bat
rm start-local.sh
rm stop-local.bat
```

### Duplicate Policy Files (now served via API)
```bash
rm PrivacyPolicy.txt
rm ReturnRefundPolicy.txt
rm ShippingPolicy.txt
rm TermsCondition.txt
```

### AWS Config Files (if not using CodeDeploy)
```bash
rm codedeploy-trust-policy.json
rm ec2-trust-policy.json
```

### Redundant Scripts in /scripts/
```bash
rm scripts/deploy-production.sh
rm scripts/ensure_admin_running.sh
rm scripts/install_dependencies.sh
rm scripts/stop_application.sh
```

## 🔧 CLEANUP COMMANDS

### Run this to clean up everything:
```bash
# Remove redundant scripts
rm debug-admin.sh debug-deployment.sh fix-admin.sh fix-deployment.sh fix-ec2.sh fix-nginx.sh fix-ports.sh rebuild-admin.sh restore-working-state.sh check-services.sh deploy-now.sh quick-deploy.sh setup-sample-images.sh

# Remove duplicate documentation
rm DATABASE_MIGRATION.md DEPLOYMENT_CHECKLIST.md DEPLOYMENT_GUIDE.md LOCAL_DEV_GUIDE.md PRODUCTION_FIX.md Mannual-Ec2-Start.txt ec2-refresh-deploy.txt

# Remove backup files
rm .gitignore.bak nginx-production.conf start-local.bat start-local.sh stop-local.bat

# Remove duplicate policy files
rm PrivacyPolicy.txt ReturnRefundPolicy.txt ShippingPolicy.txt TermsCondition.txt

# Remove AWS config files (if not needed)
rm codedeploy-trust-policy.json ec2-trust-policy.json

# Clean up scripts directory
rm scripts/deploy-production.sh scripts/ensure_admin_running.sh scripts/install_dependencies.sh scripts/stop_application.sh
```

## 📁 FINAL CLEAN PROJECT STRUCTURE

```
Ayurvedic-Ecommerce/
├── .github/workflows/          # CI/CD
├── backend/                    # API server
├── admin-panel/               # Admin dashboard
├── client-website/            # Customer website
├── scripts/
│   ├── deploy.sh             # Main deployment
│   └── start_application.sh  # EC2 startup
├── .gitignore
├── appspec.yml               # CodeDeploy config
├── nginx.conf                # Production nginx
├── QUICK_DEPLOY.md          # Deployment guide
├── README.md                # Main documentation
└── start-all.sh             # Local development
```

## 💾 SPACE SAVED
After cleanup: **~50+ files removed**, cleaner project structure, easier maintenance!