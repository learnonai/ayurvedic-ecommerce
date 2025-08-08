import React, { useState, useEffect } from 'react';
import { orders } from '../utils/api';

const Orders = () => {
  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orders.getAll();
      setOrderList(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orders.updateStatus(orderId, status);
      fetchOrders();
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  return (
    <div>
      <h2>Orders Management</h2>
      
      {!showDetails ? (
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
              {orderList.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.shippingAddress?.name || 'N/A'}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info me-2"
                      onClick={() => viewOrderDetails(order)}
                    >
                      View Details
                    </button>
                    <select 
                      className="form-select form-select-sm d-inline-block" 
                      style={{width: 'auto'}}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
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
                      value={selectedOrder.status}
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
                        <td>{item.product?.name || 'Product'}</td>
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