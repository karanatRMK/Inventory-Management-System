import React from 'react';

const ProductTable = ({ products, db, onEdit, onDelete }) => {
  const settings = db.getSettings();
  const criticalThreshold = settings.criticalStockThreshold || 5;
  const lowThreshold = settings.lowStockThreshold || 10;

  const getStockStatus = (product) => {
    let stockClass = '';
    let statusBadge = '';
    let discountBadge = '';
    let displayPrice = product.price;

    // Check for near expiry and apply discount
    if (product.expiryDate) {
      const today = new Date();
      const expiryDate = new Date(product.expiryDate);
     
      if (expiryDate >= today) {
        const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
       
        if (daysRemaining <= 7) {
          const discount = db.calculateDiscount(product.expiryDate);
          if (discount > 0) {
            displayPrice = product.price * (1 - discount);
            discountBadge = `<span class="badge badge-warning">${Math.round(discount * 100)}% OFF</span>`;
          }
         
          if (daysRemaining <= 2) {
            statusBadge = '<span class="badge badge-danger">Expiring Soon!</span>';
          }
        }
      } else {
        statusBadge = '<span class="badge badge-danger">Expired</span>';
      }
    }
   
    if (product.stock <= criticalThreshold && !statusBadge) {
      stockClass = 'stock-critical';
      statusBadge = '<span class="badge badge-danger">Critical</span>';
    } else if (product.stock <= lowThreshold && !statusBadge) {
      stockClass = 'stock-low';
      statusBadge = '<span class="badge badge-warning">Low</span>';
    } else if (product.stock === 0 && !statusBadge) {
      statusBadge = '<span class="badge badge-danger">Out of Stock</span>';
    } else if (!statusBadge) {
      statusBadge = '<span class="badge badge-success">In Stock</span>';
    }

    return { stockClass, statusBadge, discountBadge, displayPrice };
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Unit</th>
          <th>Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => {
          const { stockClass, statusBadge, discountBadge, displayPrice } = getStockStatus(product);
          
          return (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.category}</td>
              <td className={stockClass}>{product.stock}</td>
              <td>{product.unit}</td>
              <td>
                {discountBadge && (
                  <>
                    <span className="original-price">₹{product.price.toLocaleString()}</span>
                    <br />
                  </>
                )}
                <span className={discountBadge ? 'discount-price' : ''}>
                  ₹{displayPrice.toLocaleString()}
                </span>
                {discountBadge && (
                  <span dangerouslySetInnerHTML={{ __html: discountBadge }} />
                )}
              </td>
              <td dangerouslySetInnerHTML={{ __html: statusBadge }} />
              <td>
                <button 
                  className="action-btn view-product"
                  onClick={() => {
                    let expiryInfo = '';
                    if (product.expiryDate) {
                      const today = new Date();
                      const expiryDate = new Date(product.expiryDate);
                      const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                     
                      if (expiryDate < today) {
                        expiryInfo = `\nExpiry: EXPIRED (${product.expiryDate})`;
                      } else {
                        expiryInfo = `\nExpiry: ${product.expiryDate} (${daysRemaining} days remaining)`;
                       
                        const discount = db.calculateDiscount(product.expiryDate);
                        if (discount > 0) {
                          expiryInfo += `\nCurrent Discount: ${Math.round(discount * 100)}% OFF`;
                        }
                      }
                    }
                   
                    alert(`Viewing product: ${product.name}\nSKU: ${product.sku}\nCategory: ${product.category}\nStock: ${product.stock} ${product.unit}\nPrice: ₹${product.price}${expiryInfo}\nDescription: ${product.description}`);
                  }}
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button 
                  className="action-btn edit-product"
                  onClick={() => onEdit(product)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                  className="action-btn delete-product"
                  onClick={() => onDelete(product.id)}
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

export default ProductTable;