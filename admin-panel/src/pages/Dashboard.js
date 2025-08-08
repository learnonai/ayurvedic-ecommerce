import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, orders } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    products: 0, 
    orders: 0, 
    categoryStats: {},
    orderStats: {},
    locationStats: {}
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          products.getAll(),
          orders.getAll()
        ]);
        
        // Category stats
        const categoryStats = {};
        productsRes.data.forEach(product => {
          categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
        });
        
        // Order status stats
        const orderStats = {};
        ordersRes.data.forEach(order => {
          orderStats[order.status] = (orderStats[order.status] || 0) + 1;
        });
        
        // Location stats (mock data)
        const locationStats = {
          'Mumbai': Math.floor(ordersRes.data.length * 0.3),
          'Delhi': Math.floor(ordersRes.data.length * 0.25),
          'Bangalore': Math.floor(ordersRes.data.length * 0.2),
          'Others': Math.floor(ordersRes.data.length * 0.25)
        };
        
        setStats({
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          categoryStats,
          orderStats,
          locationStats
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      
      {/* Main Stats */}
      <div className="row mb-4">
        <div className="col-md-6">
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
        <div className="col-md-6">
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
      </div>
      
      {/* Category Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Products by Category</h5>
            </div>
            <div className="card-body">
              {Object.entries(stats.categoryStats).map(([category, count]) => (
                <div key={category} className="d-flex justify-content-between mb-2">
                  <span className="text-capitalize">{category.replace('-', ' ')}</span>
                  <span className="badge bg-primary">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Status Stats */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Orders by Status</h5>
            </div>
            <div className="card-body">
              {Object.entries(stats.orderStats).map(([status, count]) => (
                <div key={status} className="d-flex justify-content-between mb-2">
                  <span className="text-capitalize">{status}</span>
                  <span className={`badge bg-${
                    status === 'delivered' ? 'success' : 
                    status === 'cancelled' ? 'danger' : 'warning'
                  }`}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Location Stats */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Orders by Location</h5>
            </div>
            <div className="card-body">
              {Object.entries(stats.locationStats).map(([city, count]) => (
                <div key={city} className="d-flex justify-content-between mb-2">
                  <span>{city}</span>
                  <span className="badge bg-info">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;