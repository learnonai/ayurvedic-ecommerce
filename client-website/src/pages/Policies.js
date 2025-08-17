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
        const baseUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:5000' 
          : 'https://learnonai.com';
        
        const response = await fetch(`${baseUrl}/api/policies`);
        const data = await response.json();
        
        setPolicies({
          privacy: data.privacy,
          returnRefund: data.returnRefund,
          shipping: data.shipping,
          terms: data.terms
        });
      } catch (error) {
        console.error('Error loading policies:', error);
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