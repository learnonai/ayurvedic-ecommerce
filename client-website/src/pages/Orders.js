import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../utils/api';

const Orders = ({ user }) => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await orders.getMyOrders();
      setOrderList(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="container my-5 text-center">
        <h2>Please Login to View Orders</h2>
        <Link to="/login" className="btn btn-success">Login</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="container my-5 text-center">Loading...</div>;
  }

  if (orderList.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2>No Orders Found</h2>
        <Link to="/products" className="btn btn-success">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2>My Orders</h2>
      <div className="row">
        {orderList.map(order => (
          <div key={order._id} className="col-12 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <h5>Order #{order._id}</h5>
                    <p className="text-muted">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p>Items: {order.items?.length || 0}</p>
                  </div>
                  <div className="col-md-4 text-end">
                    <h4 className="text-success">₹{order.totalAmount}</h4>
                    <span className={`badge bg-${
                      order.status === 'delivered' ? 'success' : 
                      order.status === 'cancelled' ? 'danger' : 'warning'
                    }`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;