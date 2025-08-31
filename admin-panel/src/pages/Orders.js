import React, { useState, useEffect } from 'react';
import { orders, products } from '../utils/api';

const Orders = () => {
  const [orderList, setOrderList] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [showArchived, setShowArchived] = useState(false);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orderList, filterPeriod, sortBy, showArchived]);

  const fetchOrders = async () => {
    try {
      const response = await orders.getAll();
      setOrderList(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await products.getAll();
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getProductName = (productId) => {
    const product = productList.find(p => p._id === productId);
    return product ? product.name : `Product ID: ${productId}`;
  };

  const filterAndSortOrders = () => {
    let filtered = [...orderList];
    
    // Filter by archive status (default to false if not set)
    filtered = filtered.filter(order => 
      showArchived ? (order.archived === true) : (order.archived !== true)
    );
    
    // Filter by time period (skip if no createdAt)
    if (filterPeriod !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const yearStart = new Date(now.getFullYear(), 0, 1);
      
      switch(filterPeriod) {
        case 'today':
          filtered = filtered.filter(order => order.createdAt && new Date(order.createdAt) >= today);
          break;
        case 'thisWeek':
          filtered = filtered.filter(order => order.createdAt && new Date(order.createdAt) >= weekStart);
          break;
        case 'lastWeek':
          const lastWeekStart = new Date(weekStart.getTime() - (7 * 24 * 60 * 60 * 1000));
          filtered = filtered.filter(order => {
            if (!order.createdAt) return false;
            const orderDate = new Date(order.createdAt);
            return orderDate >= lastWeekStart && orderDate < weekStart;
          });
          break;
        case 'thisMonth':
          filtered = filtered.filter(order => order.createdAt && new Date(order.createdAt) >= monthStart);
          break;
        case 'lastMonth':
          const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          filtered = filtered.filter(order => {
            if (!order.createdAt) return false;
            const orderDate = new Date(order.createdAt);
            return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
          });
          break;
        case 'thisYear':
          filtered = filtered.filter(order => order.createdAt && new Date(order.createdAt) >= yearStart);
          break;
      }
    }
    
    // Sort orders
    switch(sortBy) {
      case 'latest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });
        break;
      case 'oldest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateA - dateB;
        });
        break;
      case 'amount_high':
        filtered.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
        break;
      case 'amount_low':
        filtered.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0));
        break;
      case 'status':
        filtered.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
        break;
    }
    
    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orders.updateStatus(orderId, status);
      fetchOrders();
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const toggleArchiveOrder = async (orderId, archived) => {
    try {
      console.log('Archiving order:', orderId, 'archived:', archived);
      await orders.updateStatus(orderId, null, { archived });
      fetchOrders();
    } catch (error) {
      console.error('Archive error:', error);
      alert('Error archiving order: ' + (error.response?.data?.message || error.message));
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) {
      return {
        date: 'N/A',
        time: 'N/A'
      };
    }
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { hour12: true })
    };
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  return (
    <div>
      <h2>Orders Management</h2>
      
      {!showDetails ? (
        <div>
          {/* Filter and Sort Controls */}
          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label">Filter by Period:</label>
              <select 
                className="form-select"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="lastWeek">Last Week</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisYear">This Year</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Sort by:</label>
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Amount (High to Low)</option>
                <option value="amount_low">Amount (Low to High)</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">View:</label>
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                />
                <label className="form-check-label">
                  {showArchived ? 'Archived Orders' : 'Active Orders'}
                </label>
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Total Orders:</label>
              <div className="badge bg-primary fs-6">{filteredOrders.length}</div>
            </div>
          </div>
          
          <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.shippingAddress?.name || 'N/A'}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <div>{formatDateTime(order.createdAt).date}</div>
                    <small className="text-muted">{formatDateTime(order.createdAt).time}</small>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info me-2"
                      onClick={() => viewOrderDetails(order)}
                    >
                      View Details
                    </button>
                    <div className="d-flex gap-1">
                      <select 
                        className="form-select form-select-sm" 
                        style={{width: '120px'}}
                        value={order.status || 'pending'}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button 
                        className={`btn btn-sm ${order.archived ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => toggleArchiveOrder(order._id, !order.archived)}
                        title={order.archived ? 'Unarchive' : 'Archive'}
                      >
                        {order.archived ? '📂' : '🗃️'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : (
        <div>
          <button 
            className="btn btn-secondary mb-3"
            onClick={() => setShowDetails(false)}
          >
            ← Back to Orders
          </button>
          
          <div className="card">
            <div className="card-header">
              <h4>Order Details - #{selectedOrder._id.slice(-6)}</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Customer Information</h5>
                  <p><strong>Name:</strong> {selectedOrder.shippingAddress?.name}</p>
                  <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}</p>
                  <p><strong>City:</strong> {selectedOrder.shippingAddress?.city}</p>
                  <p><strong>Pincode:</strong> {selectedOrder.shippingAddress?.pincode}</p>
                </div>
                <div className="col-md-6">
                  <h5>Order Information</h5>
                  <p><strong>Order Date:</strong> {formatDateTime(selectedOrder.createdAt).date}</p>
                  <p><strong>Order Time:</strong> {formatDateTime(selectedOrder.createdAt).time}</p>
                  <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</p>
                  <p><strong>Payment Status:</strong> 
                    <span className={`badge bg-${selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'} ms-2`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                  <p><strong>Order Status:</strong>
                    <select 
                      className="form-select form-select-sm d-inline-block ms-2" 
                      style={{width: 'auto'}}
                      value={selectedOrder.status || 'pending'}
                      onChange={(e) => {
                        updateOrderStatus(selectedOrder._id, e.target.value);
                        setSelectedOrder({...selectedOrder, status: e.target.value});
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </p>
                </div>
              </div>
              
              <h5 className="mt-4">Order Items</h5>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{getProductName(item.product)}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price}</td>
                        <td>₹{item.quantity * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;