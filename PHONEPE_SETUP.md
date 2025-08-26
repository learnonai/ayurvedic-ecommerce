# PhonePe Integration Setup Guide

## Current Issue
Your PhonePe integration is failing with `KEY_NOT_CONFIGURED` error because:

1. **Wrong Test Credentials**: The credentials you provided appear to be for a different PhonePe product/service
2. **Environment Variables Missing**: Production credentials not set in environment

## Fix Required

### For Production (AWS EC2):
Set these environment variables on your server:
```bash
export PHONEPE_MERCHANT_ID="TEST-M23KZ1MPAQX3P_25081"
export PHONEPE_SALT_KEY="OTI3Y2VlOWEtMGE5Zi00Y2IwLWFmMDAtYzdmODQ1NGU1MGE1"
export NODE_ENV="production"
```

### Test with PhonePe Standard Test Credentials:
The code currently uses PhonePe's standard test merchant credentials:
- Merchant ID: `PGTESTPAYUAT`  
- Salt Key: `099eb0cd-02cf-4e2a-8aca-3e6c6aff0399`

## Next Steps:
1. Verify your credentials are for PhonePe Payment Gateway (not other PhonePe products)
2. Update environment variables on your production server
3. Restart the backend service
4. Test payment flow

## Files Fixed:
- ✅ Updated test credentials in phonepeService.js
- ⚠️  Need to set production environment variables
