import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { users } from '../utils/api';

const Users = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsData, setStatsData] = useState({ title: '', users: [] });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter && userList.length > 0) {
      handleStatClick(filter);
    }
  }, [userList, searchParams]);

  const fetchUsers = async () => {
    try {
      const response = await users.getAll();
      setUserList(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data
      const mockUsers = [
        { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', isVerified: true, createdAt: new Date(), phone: '+91-9876543210', address: 'Mumbai, Maharashtra' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', isVerified: false, createdAt: new Date(), phone: '+91-9876543211', address: 'Delhi, India' },
        { _id: '3', name: 'Admin User', email: 'admin@ayurveda.com', role: 'admin', isVerified: true, createdAt: new Date(), phone: '+91-9876543212', address: 'Bangalore, Karnataka' },
        { _id: '4', name: 'Test User', email: 'test@example.com', role: 'user', isVerified: true, createdAt: new Date(), phone: '+91-9876543213', address: 'Chennai, Tamil Nadu' },
        { _id: '5', name: 'Demo User', email: 'demo@example.com', role: 'user', isVerified: false, createdAt: new Date(), phone: '+91-9876543214', address: 'Pune, Maharashtra' },
        { _id: '6', name: 'Sample User', email: 'sample@example.com', role: 'user', isVerified: false, createdAt: new Date(), phone: '+91-9876543215', address: 'Hyderabad, Telangana' },
        { _id: '7', name: 'Another User', email: 'another@example.com', role: 'user', isVerified: true, createdAt: new Date(), phone: '+91-9876543216', address: 'Kolkata, West Bengal' }
      ];
      setUserList(mockUsers);
    }
    setLoading(false);
  };
  
  const handleVerifyUser = async (userId) => {
    try {
      await users.verify(userId);
      setUserList(userList.map(user => 
        user._id === userId ? { ...user, isVerified: true } : user
      ));
      alert('User verified successfully!');
    } catch (error) {
      alert('Error verifying user');
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleStatClick = (type) => {
    let filteredUsers = [];
    let title = '';
    
    switch(type) {
      case 'total':
        filteredUsers = userList;
        title = 'All Users';
        break;
      case 'verified':
        filteredUsers = userList.filter(u => u.isVerified);
        title = 'Verified Users';
        break;
      case 'pending':
        filteredUsers = userList.filter(u => !u.isVerified);
        title = 'Pending Verification';
        break;
      case 'admin':
        filteredUsers = userList.filter(u => u.role === 'admin');
        title = 'Admin Users';
        break;
      default:
        filteredUsers = userList;
        title = 'All Users';
    }
    
    setStatsData({ title, users: filteredUsers });
    setShowStatsModal(true);
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2>User Management</h2>
      
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card bg-info text-white" style={{cursor: 'pointer'}} onClick={() => handleStatClick('total')}>
            <div className="card-body">
              <h5>Total Users</h5>
              <h3>{userList.length}</h3>
              <small>Click for details</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white" style={{cursor: 'pointer'}} onClick={() => handleStatClick('verified')}>
            <div className="card-body">
              <h5>Verified Users</h5>
              <h3>{userList.filter(u => u.isVerified).length}</h3>
              <small>Click for details</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white" style={{cursor: 'pointer'}} onClick={() => handleStatClick('pending')}>
            <div className="card-body">
              <h5>Pending Verification</h5>
              <h3>{userList.filter(u => !u.isVerified).length}</h3>
              <small>Click for details</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white" style={{cursor: 'pointer'}} onClick={() => handleStatClick('admin')}>
            <div className="card-body">
              <h5>Admin Users</h5>
              <h3>{userList.filter(u => u.role === 'admin').length}</h3>
              <small>Click for details</small>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'primary'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`badge bg-${user.isVerified ? 'success' : 'warning'}`}>
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleViewDetails(user)}
                  >
                    View Details
                  </button>
                  {!user.isVerified && (
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => handleVerifyUser(user._id)}
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <strong>Name:</strong> {selectedUser.name}
                  </div>
                  <div className="col-md-6">
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <strong>Phone:</strong> {selectedUser.phone || 'Not provided'}
                  </div>
                  <div className="col-md-6">
                    <strong>Role:</strong> 
                    <span className={`badge bg-${selectedUser.role === 'admin' ? 'danger' : 'primary'} ms-1`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <strong>Status:</strong>
                    <span className={`badge bg-${selectedUser.isVerified ? 'success' : 'warning'} ms-1`}>
                      {selectedUser.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12">
                    <strong>Address:</strong> {selectedUser.address || 'Not provided'}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {!selectedUser.isVerified && (
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={() => {
                      handleVerifyUser(selectedUser._id);
                      setShowModal(false);
                    }}
                  >
                    Verify User
                  </button>
                )}
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showModal && <div className="modal-backdrop fade show"></div>}
      
      {/* Stats Modal */}
      {showStatsModal && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-people-fill me-2"></i>
                  {statsData.title} ({statsData.users.length})
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowStatsModal(false)}></button>
              </div>
              <div className="modal-body">
                {statsData.users.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-inbox" style={{fontSize: '3rem', color: '#6c757d'}}></i>
                    <p className="text-muted mt-2">No users found in this category</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th><i className="bi bi-person"></i> Name</th>
                          <th><i className="bi bi-envelope"></i> Email</th>
                          <th><i className="bi bi-shield"></i> Role</th>
                          <th><i className="bi bi-check-circle"></i> Status</th>
                          <th><i className="bi bi-calendar"></i> Joined</th>
                          <th><i className="bi bi-gear"></i> Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statsData.users.map(user => (
                          <tr key={user._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-circle me-2" style={{
                                  width: '32px', height: '32px', borderRadius: '50%',
                                  backgroundColor: user.role === 'admin' ? '#dc3545' : '#0d6efd',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: 'white', fontSize: '14px', fontWeight: 'bold'
                                }}>
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <strong>{user.name}</strong>
                              </div>
                            </td>
                            <td>
                              <span className="text-muted">{user.email}</span>
                            </td>
                            <td>
                              <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'primary'}`}>
                                <i className={`bi bi-${user.role === 'admin' ? 'shield-fill' : 'person'} me-1`}></i>
                                {user.role.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <span className={`badge bg-${user.isVerified ? 'success' : 'warning'}`}>
                                <i className={`bi bi-${user.isVerified ? 'check-circle-fill' : 'clock'} me-1`}></i>
                                {user.isVerified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </small>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setShowStatsModal(false);
                                    handleViewDetails(user);
                                  }}
                                  title="View Details"
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                {!user.isVerified && (
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => {
                                      handleVerifyUser(user._id);
                                      setShowStatsModal(false);
                                    }}
                                    title="Verify User"
                                  >
                                    <i className="bi bi-check-lg"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer bg-light">
                <div className="me-auto">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Showing {statsData.users.length} user{statsData.users.length !== 1 ? 's' : ''}
                  </small>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => setShowStatsModal(false)}>
                  <i className="bi bi-x-lg me-1"></i>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showStatsModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Users;