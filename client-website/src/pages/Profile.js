import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormValidation, validateName, validateEmail, validatePhone, FormError } from '../components/FormValidation';

const Profile = ({ user, onLogin }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationRules = {
    name: { required: true, validator: validateName, message: 'Name must be at least 2 characters' },
    email: { required: true, validator: validateEmail, message: 'Please enter a valid email' },
    phone: { validator: validatePhone, message: 'Please enter a valid 10-digit phone number' }
  };

  const { values: profileData, errors, touched, handleChange, handleBlur, validateAll, setValues } = useFormValidation(
    {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    },
    validationRules
  );

  React.useEffect(() => {
    if (user) {
      setValues({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user, setValues]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    setLoading(true);
    try {
      // Mock API call - in real app, would call user update API
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onLogin(updatedUser);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setValues({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="container my-5 text-center">
        <h2>Please Login to View Profile</h2>
        <button className="btn btn-success" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">👤 My Profile</h4>
              {!editing && (
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setEditing(true)}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>
            <div className="card-body">
              {editing ? (
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                      value={profileData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      required
                    />
                    <FormError message={touched.name ? errors.name : ''} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                      value={profileData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      required
                    />
                    <FormError message={touched.email ? errors.email : ''} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone && touched.phone ? 'is-invalid' : ''}`}
                      value={profileData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="10-digit phone number"
                    />
                    <FormError message={touched.phone ? errors.phone : ''} />
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : '💾 Save Changes'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Name:</strong></div>
                    <div className="col-sm-9">{user.name}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Email:</strong></div>
                    <div className="col-sm-9">{user.email}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Phone:</strong></div>
                    <div className="col-sm-9">{user.phone || 'Not provided'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Role:</strong></div>
                    <div className="col-sm-9">
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                      </span>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Status:</strong></div>
                    <div className="col-sm-9">
                      <span className={`badge ${user.isVerified ? 'bg-success' : 'bg-warning'}`}>
                        {user.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">🚀 Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate('/orders')}
                  >
                    📦 My Orders
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-outline-success w-100"
                    onClick={() => navigate('/wishlist')}
                  >
                    ❤️ My Wishlist
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-outline-info w-100"
                    onClick={() => navigate('/cart')}
                  >
                    🛒 My Cart
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={() => navigate('/products')}
                  >
                    🛍️ Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;