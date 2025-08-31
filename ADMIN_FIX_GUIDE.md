# 🔧 Admin Panel Production Fix Guide

## Issues Fixed

1. **Missing `archived` field** in orders causing filter failures
2. **API connectivity issues** in production environment  
3. **Browser caching** preventing updates from showing
4. **Error handling** improvements for better debugging

## Quick Fix Steps

### 1. Local Preparation
```bash
# Run the fix script locally
./fix-admin-prod.sh
```

### 2. Deploy to Production
```bash
# Copy files to EC2
scp -r admin-panel ec2-user@learnonai.com:/home/ec2-user/ayurvedic-ecommerce/
scp -r backend/data ec2-user@learnonai.com:/home/ec2-user/ayurvedic-ecommerce/backend/

# SSH to EC2 and restart services
ssh ec2-user@learnonai.com
cd /home/ec2-user/ayurvedic-ecommerce
pm2 restart all
```

### 3. Clear Browser Cache
- Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
- Or open DevTools → Network → check "Disable cache"

## Verification Steps

1. **Check Backend API**:
   ```bash
   curl https://learnonai.com/api/orders
   ```

2. **Check Admin Panel**:
   - Go to https://learnonai.com:8080
   - Login with admin@ayurveda.com / admin123
   - Navigate to Orders page
   - Test filter functionality
   - Test archive/unarchive buttons

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for any red errors
   - Check Network tab for failed requests

## Troubleshooting

### If Orders Page is Blank:
1. Check browser console for errors
2. Verify API connectivity: `curl https://learnonai.com/api/orders`
3. Check PM2 status: `pm2 list`
4. Check backend logs: `pm2 logs backend`

### If Filters Don't Work:
1. Clear browser cache completely
2. Check if orders have `archived` field in database
3. Verify JavaScript console for filter errors

### If Archive Function Fails:
1. Check backend logs for update errors
2. Verify order ID format in requests
3. Test API endpoint directly:
   ```bash
   curl -X PUT https://learnonai.com/api/orders/ORDER_ID/status \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer YOUR_TOKEN" \
        -d '{"archived": true}'
   ```

## Files Modified

- `backend/data/orders.json` - Added missing `archived` fields
- `admin-panel/src/utils/api.js` - Improved error handling
- `admin-panel/src/pages/Orders.js` - Better state management
- `admin-panel/src/components/DebugInfo.js` - Debug component (dev only)

## Production URLs

- **Admin Panel**: https://learnonai.com:8080
- **Backend API**: https://learnonai.com/api
- **Customer Site**: https://learnonai.com

## Emergency Rollback

If issues persist:
```bash
cd /home/ec2-user/ayurvedic-ecommerce
./scripts/rollback.sh
```

---

**Need Help?** Check the browser console and PM2 logs first!