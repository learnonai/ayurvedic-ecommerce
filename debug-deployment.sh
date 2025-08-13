#!/bin/bash

echo "🔍 DEBUGGING LEARNONAI.COM DEPLOYMENT"
echo "======================================"

echo -e "\n1. Testing API Endpoint:"
curl -s -w "Status: %{http_code}\n" https://learnonai.com/api/products | head -10

echo -e "\n2. Testing Admin Panel:"
curl -s -w "Status: %{http_code}\n" https://learnonai.com/admin | head -5

echo -e "\n3. Testing Client Website:"
curl -s -w "Status: %{http_code}\n" https://learnonai.com | head -5

echo -e "\n4. Testing Direct Backend:"
curl -s -w "Status: %{http_code}\n" http://3.91.235.214:5000/api/products | head -10

echo -e "\n5. Testing Direct Admin:"
curl -s -w "Status: %{http_code}\n" http://3.91.235.214:3000 | head -5

echo -e "\n6. Testing Direct Client:"
curl -s -w "Status: %{http_code}\n" http://3.91.235.214:3001 | head -5

echo -e "\n7. DNS Resolution:"
nslookup learnonai.com

echo -e "\n8. SSL Certificate Check:"
echo | openssl s_client -servername learnonai.com -connect learnonai.com:443 2>/dev/null | openssl x509 -noout -dates

echo -e "\n✅ Debug completed!"