import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, orders, users } from '../utils/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    products: 0, 
    orders: 0, 
    users: 0,
    verifiedUsers: 0,
    pendingUsers: 0,
    adminUsers: 0,
    categoryStats: {},
    orderStats: {},
    locationStats: {}
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {

        const [productsRes, ordersRes, usersRes] = await Promise.all([
          products.getAll(),
          orders.getAll(),
          users.getAll().catch(() => ({ data: [] }))
        ]);
        

        
        // Category stats
        const categoryStats = {};
        (productsRes.data || []).forEach(product => {
          categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
        });
        
        // Order status stats
        const orderStats = {};
        (ordersRes.data || []).forEach(order => {
          orderStats[order.status] = (orderStats[order.status] || 0) + 1;
        });
        
        // Location stats from actual orders
        const locationStats = {};
        (ordersRes.data || []).forEach(order => {
          const city = order.shippingAddress?.city || 'Others';
          locationStats[city] = (locationStats[city] || 0) + 1;
        });
        
        // User stats
        const userList = usersRes.data || [];
        const verifiedUsers = userList.filter(u => u.isVerified).length;
        const adminUsers = userList.filter(u => u.role === 'admin').length;
        
        setStats({
          products: (productsRes.data || []).length,
          orders: (ordersRes.data || []).length,
          users: userList.length,
          verifiedUsers,
          pendingUsers: userList.length - verifiedUsers,
          adminUsers,
          categoryStats,
          orderStats,
          locationStats
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Loading Dashboard</h4>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>
      
      {/* Main Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <Link to="/products" className="text-decoration-none">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h4>Total Products</h4>
                <h2>{stats.products}</h2>
                <small>Click to manage products</small>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/orders" className="text-decoration-none">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h4>Total Orders</h4>
                <h2>{stats.orders}</h2>
                <small>Click to manage orders</small>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/users" className="text-decoration-none">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h4>Total Users</h4>
                <h2>{stats.users}</h2>
                <small>Click to manage users</small>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h4>Verified Users</h4>
              <h2>{stats.verifiedUsers}</h2>
              <small>Active users</small>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Stats Row */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Link to="/users?filter=pending" className="text-decoration-none">
            <div className="card bg-light" style={{cursor: 'pointer'}}>
              <div className="card-body text-center">
                <h5>Pending Verification</h5>
                <h3 className="text-warning">{stats.pendingUsers}</h3>
                <small>Click to view pending users</small>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/users?filter=admin" className="text-decoration-none">
            <div className="card bg-light" style={{cursor: 'pointer'}}>
              <div className="card-body text-center">
                <h5>Admin Users</h5>
                <h3 className="text-danger">{stats.adminUsers}</h3>
                <small>Click to view admin users</small>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5>User Growth</h5>
              <h3 className="text-success">+1</h3>
              <small>This month</small>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h5>Products by Category</h5>
              <small className="text-muted">Click numbers for details</small>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  {Object.entries(stats.categoryStats).map(([category, count]) => (
                    <div key={category} className="d-flex justify-content-between mb-2" 
                         style={{cursor: 'pointer'}} 
                         onClick={() => setSelectedCategory(category)}>
                      <span className="text-capitalize">{category.replace('-', ' ')}</span>
                      <span className="badge bg-primary">{count}</span>
                    </div>
                  ))}
                </div>
                <div className="col-6">
                  {Object.keys(stats.categoryStats).length > 0 && (
                    <Pie 
                      data={{
                        labels: Object.keys(stats.categoryStats).map(c => c.replace('-', ' ')),
                        datasets: [{
                          data: Object.values(stats.categoryStats),
                          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Status Stats */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h5>Orders by Status</h5>
              <small className="text-muted">Click numbers for details</small>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  {Object.entries(stats.orderStats).map(([status, count]) => (
                    <div key={status} className="d-flex justify-content-between mb-2"
                         style={{cursor: 'pointer'}}
                         onClick={() => setSelectedStatus(status)}>
                      <span className="text-capitalize">{status}</span>
                      <span className={`badge bg-${
                        status === 'delivered' ? 'success' : 
                        status === 'cancelled' ? 'danger' : 'warning'
                      }`}>{count}</span>
                    </div>
                  ))}
                </div>
                <div className="col-6">
                  {Object.keys(stats.orderStats).length > 0 && (
                    <Pie 
                      data={{
                        labels: Object.keys(stats.orderStats),
                        datasets: [{
                          data: Object.values(stats.orderStats),
                          backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#17a2b8']
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location Stats */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h5>Orders by Location</h5>
              <small className="text-muted">Click numbers for details</small>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  {Object.entries(stats.locationStats).map(([city, count]) => (
                    <div key={city} className="d-flex justify-content-between mb-2"
                         style={{cursor: 'pointer'}}
                         onClick={() => setSelectedLocation(city)}>
                      <span>{city}</span>
                      <span className="badge bg-info">{count}</span>
                    </div>
                  ))}
                </div>
                <div className="col-6">
                  {Object.keys(stats.locationStats).length > 0 && (
                    <Pie 
                      data={{
                        labels: Object.keys(stats.locationStats),
                        datasets: [{
                          data: Object.values(stats.locationStats),
                          backgroundColor: ['#007bff', '#6c757d', '#28a745', '#ffc107', '#dc3545']
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Details Modal/Alert */}
      {selectedCategory && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          <strong>Category Details:</strong> Showing products in "{selectedCategory.replace('-', ' ')}" category.
          <Link to={`/products?category=${selectedCategory}`} className="btn btn-sm btn-outline-primary ms-2">
            View Products
          </Link>
          <button type="button" className="btn-close" onClick={() => setSelectedCategory(null)}></button>
        </div>
      )}
      
      {selectedStatus && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Order Status:</strong> Showing orders with "{selectedStatus}" status.
          <Link to={`/orders?status=${selectedStatus}`} className="btn btn-sm btn-outline-primary ms-2">
            View Orders
          </Link>
          <button type="button" className="btn-close" onClick={() => setSelectedStatus(null)}></button>
        </div>
      )}
      
      {selectedLocation && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Location Details:</strong> Showing orders from "{selectedLocation}".
          <Link to={`/orders?location=${selectedLocation}`} className="btn btn-sm btn-outline-primary ms-2">
            View Orders
          </Link>
          <button type="button" className="btn-close" onClick={() => setSelectedLocation(null)}></button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;