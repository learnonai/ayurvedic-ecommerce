import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data
      const mockUsers = [
        { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', isVerified: true, createdAt: new Date() },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', isVerified: false, createdAt: new Date() },
        { _id: '3', name: 'Admin User', email: 'admin@ayurveda.com', role: 'admin', isVerified: true, createdAt: new Date() }
      ];
      setUsers(mockUsers);
    }
    setLoading(false);
  };
  
  const handleVerifyUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${userId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isVerified: true } : user
      ));
      alert('User verified successfully!');
    } catch (error) {
      alert('Error verifying user');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2>User Management</h2>
      
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5>Total Users</h5>
              <h3>{users.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Verified Users</h5>
              <h3>{users.filter(u => u.isVerified).length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5>Pending Verification</h5>
              <h3>{users.filter(u => !u.isVerified).length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Admin Users</h5>
              <h3>{users.filter(u => u.role === 'admin').length}</h3>
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
            {users.map(user => (
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
                  <button className="btn btn-sm btn-outline-primary me-2">
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
    </div>
  );
};

export default Users;