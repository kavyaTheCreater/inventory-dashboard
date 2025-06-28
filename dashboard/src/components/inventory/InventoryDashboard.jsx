import React, { useState, useEffect } from 'react';
import InventoryList from './InventoryList';
import ItemForm from './ItemForm';
import InventoryStats from './InventoryStats';

const InventoryDashboard = () => {
  const [view, setView] = useState('list'); // 'list', 'stats', 'add', 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Reset view state when component unmounts
  useEffect(() => {
    return () => {
      setSelectedItem(null);
    };
  }, []);
  
  const handleAddItemClick = () => {
    setSelectedItem(null);
    setView('add');
  };
  
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setView('edit');
  };
  
  const handleFormSave = () => {
    // After adding or editing, return to the list view
    setSelectedItem(null);
    setView('list');
  };
  
  const handleFormCancel = () => {
    // If canceling, return to previous view
    setSelectedItem(null);
    setView('list');
  };
  
  const renderContent = () => {
    switch (view) {
      case 'stats':
        return <InventoryStats />;
      case 'add':
      case 'edit':
        return (
          <ItemForm
            item={selectedItem}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        );
      case 'list':
      default:
        return (
          <InventoryList
            onEdit={handleEditItem}
            onAddNew={handleAddItemClick}
          />
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded transition ${
              view === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inventory List
          </button>
          <button
            onClick={() => setView('stats')}
            className={`px-4 py-2 rounded transition ${
              view === 'stats'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={handleAddItemClick}
            className={`px-4 py-2 rounded transition ${
              view === 'add'
                ? 'bg-blue-600 text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Add New
          </button>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default InventoryDashboard;