import React, { useState, useEffect } from 'react';
import { addInventoryItem, updateInventoryItem, getCategories } from '../../data/inventoryData';

const ItemForm = ({ item = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    threshold: 5,
    supplier: '',
    newCategory: ''
  });
  
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [showNewCategoryField, setShowNewCategoryField] = useState(false);
  
  // Load data if editing an existing item
  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        newCategory: ''
      });
    }
    
    setCategories(getCategories());
  }, [item]);
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.category && !formData.newCategory) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.quantity < 0 || isNaN(formData.quantity)) {
      newErrors.quantity = 'Quantity must be a non-negative number';
    }
    
    if (formData.price <= 0 || isNaN(formData.price)) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (formData.threshold < 0 || isNaN(formData.threshold)) {
      newErrors.threshold = 'Threshold must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'quantity' || name === 'threshold') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // If selecting "Add New Category"
    if (name === 'category' && value === 'add_new') {
      setShowNewCategoryField(true);
      setFormData({ ...formData, category: '' });
    } else if (name === 'category') {
      setShowNewCategoryField(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const finalItem = { ...formData };
    
    // Use new category if provided
    if (formData.newCategory) {
      finalItem.category = formData.newCategory;
    }
    
    // Remove helper fields
    delete finalItem.newCategory;
    
    if (item) {
      // Update existing item
      updateInventoryItem(finalItem);
    } else {
      // Add new item
      addInventoryItem(finalItem);
    }
    
    onSave();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {item ? 'Edit Item' : 'Add New Item'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter item name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value="add_new">+ Add New Category</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          
          {/* New Category (conditional) */}
          {showNewCategoryField && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Category Name*
              </label>
              <input
                type="text"
                name="newCategory"
                value={formData.newCategory}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter new category name"
              />
            </div>
          )}
          
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity*
            </label>
            <input
              type="number"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
          </div>
          
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)*
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          
          {/* Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Low Stock Threshold*
            </label>
            <input
              type="number"
              name="threshold"
              min="0"
              value={formData.threshold}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.threshold ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.threshold && <p className="text-red-500 text-xs mt-1">{errors.threshold}</p>}
            <p className="text-xs text-gray-500 mt-1">Items will be marked as "Low Stock" when quantity falls below this number</p>
          </div>
          
          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter supplier name"
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded mr-3 hover:bg-gray-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {item ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;