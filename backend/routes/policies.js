const express = require('express');
const router = express.Router();

const policies = {
  privacy: `PRIVACY POLICY

Last updated: January 2025

1. INFORMATION WE COLLECT
We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.

2. HOW WE USE YOUR INFORMATION
- Process transactions and orders
- Communicate with you about products and services
- Improve our website and services
- Comply with legal obligations

3. INFORMATION SHARING
We do not sell, trade, or rent your personal information to third parties without your consent.

4. DATA SECURITY
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. COOKIES
Our website uses cookies to enhance your browsing experience and analyze website traffic.

6. YOUR RIGHTS
You have the right to access, update, or delete your personal information at any time.

7. CONTACT US
If you have questions about this Privacy Policy, please contact us at privacy@ayurveda.com`,

  returnRefund: `RETURN & REFUND POLICY

Last updated: January 2025

1. RETURN ELIGIBILITY
- Items must be returned within 30 days of purchase
- Products must be in original condition and packaging
- Herbal medicines cannot be returned once opened for safety reasons

2. REFUND PROCESS
- Refunds will be processed within 7-10 business days
- Original shipping charges are non-refundable
- Refunds will be credited to the original payment method

3. NON-RETURNABLE ITEMS
- Opened medicine bottles or packages
- Personalized or custom-made products
- Perishable goods

4. HOW TO RETURN
- Contact our customer service at returns@ayurveda.com
- Obtain a Return Authorization Number (RAN)
- Ship items back with RAN clearly marked

5. DAMAGED OR DEFECTIVE ITEMS
We will replace or refund damaged/defective items at no cost to you.
- Replacement products will be delivered within 5-7 business days

6. CONTACT US
For return inquiries, email us at returns@ayurveda.com or call +91-9876543210`,

  shipping: `SHIPPING POLICY

Last updated: January 2025

1. SHIPPING AREAS
We currently ship across India. International shipping is not available at this time.

2. DELIVERY TIMEFRAMES
- Metro Cities: 2-3 business days
- Other Cities: 4-6 business days
- Remote Areas: 7-10 business days

3. SHIPPING CHARGES
- Orders above ₹500: FREE shipping
- Orders below ₹500: ₹50 shipping charge
- Express delivery: Additional ₹100

4. ORDER PROCESSING
- Orders are processed within 24 hours of payment confirmation
- Orders placed on weekends/holidays will be processed the next business day

5. TRACKING
- Tracking information will be sent via SMS and email
- You can track your order on our website using the order ID

6. DELIVERY ISSUES
- If no one is available at delivery address, we will attempt redelivery
- After 3 failed attempts, the order will be returned to our warehouse

7. CONTACT US
For shipping inquiries, contact us at shipping@ayurveda.com`,

  terms: `TERMS & CONDITIONS

Last updated: January 2025

1. ACCEPTANCE OF TERMS
By using our website, you agree to these Terms & Conditions.

2. USE OF WEBSITE
- You must be 18+ years old to make purchases
- Provide accurate information during registration
- Do not misuse our website or services

3. PRODUCT INFORMATION
- We strive for accuracy in product descriptions
- Herbal products are not intended to diagnose, treat, cure, or prevent any disease
- Consult healthcare professionals before use

4. PRICING & PAYMENT
- All prices are in Indian Rupees (INR)
- Prices may change without notice
- Payment must be completed before order processing

5. USER ACCOUNTS
- You are responsible for maintaining account security
- Notify us immediately of any unauthorized use
- We may suspend accounts for policy violations

6. INTELLECTUAL PROPERTY
All content on this website is our property and protected by copyright laws.

7. LIMITATION OF LIABILITY
We are not liable for any indirect, incidental, or consequential damages.

8. GOVERNING LAW
These terms are governed by the laws of India.

9. CONTACT US
For questions about these terms, contact us at legal@ayurveda.com`
};

// Get all policies
router.get('/', (req, res) => {
  res.json(policies);
});

// Get specific policy
router.get('/:type', (req, res) => {
  const { type } = req.params;
  if (policies[type]) {
    res.json({ content: policies[type] });
  } else {
    res.status(404).json({ error: 'Policy not found' });
  }
});

module.exports = router;