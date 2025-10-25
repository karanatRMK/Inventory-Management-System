import React from 'react';

const OrderTable = ({ orders, onEdit, onDelete }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Received':
        return '<span class="badge badge-success">Received</span>';
      case 'Shipped':
        return '<span class="badge badge-warning">Shipped</span>';
      case 'Pending':
        return '<span class="badge badge-danger">Pending</span>';
      case 'Approved':
        return '<span class="badge badge-primary">Approved</span>';
      case 'Cancelled':
        return '<span class="badge badge-secondary">Cancelled</span>';
      default:
        return '<span class="badge badge-secondary">Unknown</span>';
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>PO Number</th>
          <th>Supplier</th>
          <th>Date</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{order.poNumber}</td>
            <td>{order.supplierName}</td>
            <td>{order.date}</td>
            <td>{order.items.length}</td>
            <td>₹{order.total.toLocaleString()}</td>
            <td dangerouslySetInnerHTML={{ __html: getStatusBadge(order.status) }} />
            <td>
              <button 
                className="action-btn view-order"
                onClick={() => {
                  let itemsText = order.items.map(item => {
                    return `${item.productId} - ${item.quantity} x ₹${item.price}`;
                  }).join('\n');
                 
                  alert(`Viewing order: ${order.poNumber}\nSupplier: ${order.supplierName}\nDate: ${order.date}\nStatus: ${order.status}\nTotal: ₹${order.total}\nItems:\n${itemsText}\nNotes: ${order.notes}`);
                }}
              >
                <i className="fas fa-eye"></i>
              </button>
              <button 
                className="action-btn edit-order"
                onClick={() => onEdit(order)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                className="action-btn delete-order"
                onClick={() => onDelete(order.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;