import React, { useEffect, useState } from 'react';
import { getInventoryStats, getOutOfStockItems, getLowStockItems } from '../../data/inventoryData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const InventoryStats = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    outOfStock: 0,
    lowStock: 0,
    categories: {}
  });
  
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  
  useEffect(() => {
    // Load inventory statistics
    setStats(getInventoryStats());
    setOutOfStockItems(getOutOfStockItems());
    setLowStockItems(getLowStockItems());
  }, []);
  
  // Prepare data for category pie chart
  const categoryData = Object.entries(stats.categories || {}).map(([name, value]) => ({
    name,
    value
  }));
  
  // Prepare data for stock status chart
  const stockStatusData = [
    { name: 'Out of Stock', value: stats.outOfStock },
    { name: 'Low Stock', value: stats.lowStock },
    { name: 'Normal Stock', value: stats.totalItems - stats.outOfStock - stats.lowStock }
  ].filter(item => item.value > 0);
  
  // Colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-800">{stats.totalItems}</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalValue)}</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-red-600">{stats.outOfStock}</span>
            <span className="text-sm text-gray-500 ml-2">items</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Low Stock</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-yellow-600">{stats.lowStock}</span>
            <span className="text-sm text-gray-500 ml-2">items</span>
          </div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Items by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} items`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Stock Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell key="cell-0" fill="#FF8042" /> {/* Out of Stock - Orange */}
                  <Cell key="cell-1" fill="#FFBB28" /> {/* Low Stock - Yellow */}
                  <Cell key="cell-2" fill="#00C49F" /> {/* Normal Stock - Green */}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} items`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Attention Required Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Out of Stock Items */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Out of Stock Items</h2>
          {outOfStockItems.length > 0 ? (
            <div className="overflow-y-auto max-h-60">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {outOfStockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3">{item.name}</td>
                      <td className="py-2 px-3">{item.category}</td>
                      <td className="py-2 px-3 text-right">${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No out of stock items</p>
          )}
        </div>
        
        {/* Low Stock Items */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Low Stock Items</h2>
          {lowStockItems.length > 0 ? (
            <div className="overflow-y-auto max-h-60">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase">Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lowStockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3">{item.name}</td>
                      <td className="py-2 px-3">{item.category}</td>
                      <td className="py-2 px-3 text-right">{item.quantity}</td>
                      <td className="py-2 px-3 text-right">{item.threshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No low stock items</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryStats;