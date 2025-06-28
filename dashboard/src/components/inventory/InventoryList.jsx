import React, { useState, useEffect } from 'react';
import { 
  getInventoryItems, 
  deleteInventoryItem,
  updateInventoryItem,
  filterInventoryItems,
  getCategories
} from '../../data/inventoryData';

const InventoryList = ({ onEdit, onAddNew }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    stockStatus: 'all'
  });

  useEffect(() => {
    // Load inventory items
    loadItems();
    setCategories(getCategories());
  }, []);

  const loadItems = () => {
    const filteredItems = filterInventoryItems(filters);
    setItems(filteredItems);
  };

  // Apply filters when they change
  useEffect(() => {
    loadItems();
  }, [filters]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItem(id);
      loadItems();
    }
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 0) return;
    
    const updatedItem = {
      ...item,
      quantity: parseInt(newQuantity, 10)
    };
    
    updateInventoryItem(updatedItem);
    loadItems();
  };

  const getStockStatus = (item) => {
    if (item.quantity === 0) {
      return { label: 'Out of Stock', class: 'bg-red-100 text-red-800' };
    } else if (item.quantity <= item.threshold) {
      return { label: 'Low Stock', class: 'bg-yellow-100 text-yellow-800' };
    }
    return { label: 'In Stock', class: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Inventory Items</h2>
        <button 
          onClick={onAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search items..."
            className="w-full p-2 border border-gray-300 rounded"
            value={filters.searchTerm}
            onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={filters.stockStatus}
            onChange={(e) => setFilters({...filters, stockStatus: e.target.value})}
          >
            <option value="all">All Items</option>
            <option value="out">Out of Stock</option>
            <option value="low">Low Stock</option>
            <option value="normal">Normal Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.length > 0 ? (
              items.map((item) => {
                const status = getStockStatus(item);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">{item.name}</td>
                    <td className="py-4 px-4">{item.category}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="p-1 bg-gray-200 rounded-l hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="p-1 bg-gray-200 rounded-r hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">${item.price.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs rounded ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                  No items found. Try adjusting your filters or add new items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryList;