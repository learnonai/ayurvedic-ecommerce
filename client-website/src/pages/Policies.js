import React, { useState, useEffect } from 'react';

const Policies = () => {
  const [policies, setPolicies] = useState({
    privacy: '',
    returnRefund: '',
    shipping: '',
    terms: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:5000' 
          : 'https://learnonai.com';
        
        const response = await fetch(`${baseUrl}/api/policies`);
        
        if (!response.ok) {
          throw new Error('API not available');
        }
        
        const data = await response.json();
        
        setPolicies({
          privacy: data.privacy,
          returnRefund: data.returnRefund,
          shipping: data.shipping,
          terms: data.terms
        });
      } catch (error) {
        console.error('Error loading policies from API:', error);
        // Fallback to static content for local development
        setPolicies({
          privacy: `PRIVACY POLICY\n\nLast updated: January 2025\n\n1. INFORMATION WE COLLECT\nWe collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.\n\n2. HOW WE USE YOUR INFORMATION\n- Process transactions and orders\n- Communicate with you about products and services\n- Improve our website and services\n- Comply with legal obligations\n\n3. INFORMATION SHARING\nWe do not sell, trade, or rent your personal information to third parties without your consent.\n\n4. DATA SECURITY\nWe implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.\n\n5. COOKIES\nOur website uses cookies to enhance your browsing experience and analyze website traffic.\n\n6. YOUR RIGHTS\nYou have the right to access, update, or delete your personal information at any time.\n\n7. CONTACT US\nIf you have questions about this Privacy Policy, please contact us at privacy@ayurveda.com`,
          
          returnRefund: `RETURN & REFUND POLICY\n\nLast updated: January 2025\n\n1. RETURN ELIGIBILITY\n- Items must be returned within 30 days of purchase\n- Products must be in original condition and packaging\n- Herbal medicines cannot be returned once opened for safety reasons\n\n2. REFUND PROCESS\n- Refunds will be processed within 7-10 business days\n- Original shipping charges are non-refundable\n- Refunds will be credited to the original payment method\n\n3. NON-RETURNABLE ITEMS\n- Opened medicine bottles or packages\n- Personalized or custom-made products\n- Perishable goods\n\n4. HOW TO RETURN\n- Contact our customer service at returns@ayurveda.com\n- Obtain a Return Authorization Number (RAN)\n- Ship items back with RAN clearly marked\n\n5. DAMAGED OR DEFECTIVE ITEMS\nWe will replace or refund damaged/defective items at no cost to you.\n- Replacement products will be delivered within 5-7 business days\n\n6. CONTACT US\nFor return inquiries, email us at returns@ayurveda.com or call +91-9876543210`,
          
          shipping: `SHIPPING POLICY\n\nLast updated: January 2025\n\n1. SHIPPING AREAS\nWe currently ship across India. International shipping is not available at this time.\n\n2. DELIVERY TIMEFRAMES\n- Metro Cities: 2-3 business days\n- Other Cities: 4-6 business days\n- Remote Areas: 7-10 business days\n\n3. SHIPPING CHARGES\n- Orders above ₹500: FREE shipping\n- Orders below ₹500: ₹50 shipping charge\n- Express delivery: Additional ₹100\n\n4. ORDER PROCESSING\n- Orders are processed within 24 hours of payment confirmation\n- Orders placed on weekends/holidays will be processed the next business day\n\n5. TRACKING\n- Tracking information will be sent via SMS and email\n- You can track your order on our website using the order ID\n\n6. DELIVERY ISSUES\n- If no one is available at delivery address, we will attempt redelivery\n- After 3 failed attempts, the order will be returned to our warehouse\n\n7. CONTACT US\nFor shipping inquiries, contact us at shipping@ayurveda.com`,
          
          terms: `TERMS & CONDITIONS\n\nLast updated: January 2025\n\n1. ACCEPTANCE OF TERMS\nBy using our website, you agree to these Terms & Conditions.\n\n2. USE OF WEBSITE\n- You must be 18+ years old to make purchases\n- Provide accurate information during registration\n- Do not misuse our website or services\n\n3. PRODUCT INFORMATION\n- We strive for accuracy in product descriptions\n- Herbal products are not intended to diagnose, treat, cure, or prevent any disease\n- Consult healthcare professionals before use\n\n4. PRICING & PAYMENT\n- All prices are in Indian Rupees (INR)\n- Prices may change without notice\n- Payment must be completed before order processing\n\n5. USER ACCOUNTS\n- You are responsible for maintaining account security\n- Notify us immediately of any unauthorized use\n- We may suspend accounts for policy violations\n\n6. INTELLECTUAL PROPERTY\nAll content on this website is our property and protected by copyright laws.\n\n7. LIMITATION OF LIABILITY\nWe are not liable for any indirect, incidental, or consequential damages.\n\n8. GOVERNING LAW\nThese terms are governed by the laws of India.\n\n9. CONTACT US\nFor questions about these terms, contact us at legal@ayurveda.com`
        });
      } finally {
        setLoading(false);
      }
    };

    loadPolicies();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading policies...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-5 text-success">📋 Our Policies</h1>
          
          {/* Privacy Policy */}
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">🔒 Privacy Policy</h3>
            </div>
            <div className="card-body">
              <pre className="policy-text">{policies.privacy}</pre>
            </div>
          </div>

          {/* Return & Refund Policy */}
          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h3 className="mb-0">↩️ Return & Refund Policy</h3>
            </div>
            <div className="card-body">
              <pre className="policy-text">{policies.returnRefund}</pre>
            </div>
          </div>

          {/* Shipping Policy */}
          <div className="card mb-4">
            <div className="card-header bg-warning text-dark">
              <h3 className="mb-0">🚚 Shipping Policy</h3>
            </div>
            <div className="card-body">
              <pre className="policy-text">{policies.shipping}</pre>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="card mb-4">
            <div className="card-header bg-danger text-white">
              <h3 className="mb-0">📜 Terms & Conditions</h3>
            </div>
            <div className="card-body">
              <pre className="policy-text">{policies.terms}</pre>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card bg-light">
            <div className="card-body text-center">
              <h4 className="text-success">📞 Need Help?</h4>
              <p className="mb-2">
                <strong>Email:</strong> support@ayurveda.com<br/>
                <strong>Phone:</strong> +91-9876543210<br/>
                <strong>Address:</strong> 123 Ayurveda Street, Wellness City, India
              </p>
              <small className="text-muted">
                Last updated: January 2025 | All policies are subject to change without prior notice
              </small>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .policy-text {
          white-space: pre-wrap;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          background: none;
          border: none;
          margin: 0;
          padding: 0;
        }
        
        .card-header h3 {
          font-size: 1.25rem;
        }
        
        @media (max-width: 768px) {
          .policy-text {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Policies;