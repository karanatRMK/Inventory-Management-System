import React from 'react';

const SupplierTable = ({ suppliers, onEdit, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Supplier</th>
          <th>Contact</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Products</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map(supplier => {
          const statusBadge = supplier.status === 'Active'
            ? '<span class="badge badge-success">Active</span>'
            : '<span class="badge badge-warning">Inactive</span>';
          
          return (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.contact}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.email}</td>
              <td>{supplier.products}</td>
              <td dangerouslySetInnerHTML={{ __html: statusBadge }} />
              <td>
                <button 
                  className="action-btn view-supplier"
                  onClick={() => {
                    alert(`Viewing supplier: ${supplier.name}\nContact: ${supplier.contact}\nPhone: ${supplier.phone}\nEmail: ${supplier.email}\nCategory: ${supplier.category}\nProducts: ${supplier.products}\nStatus: ${supplier.status}\nAddress: ${supplier.address}`);
                  }}
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button 
                  className="action-btn edit-supplier"
                  onClick={() => onEdit(supplier)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                  className="action-btn delete-supplier"
                  onClick={() => onDelete(supplier.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SupplierTable;