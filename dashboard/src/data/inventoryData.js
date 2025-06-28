// Initial inventory data with sample items
export const initialInventoryData = [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    quantity: 15,
    price: 999.99,
    threshold: 5,
    supplier: "Tech Solutions Inc.",
    lastUpdated: new Date("2023-06-01").toISOString()
  },
  {
    id: 2,
    name: "Office Chair",
    category: "Furniture",
    quantity: 25,
    price: 149.99,
    threshold: 8,
    supplier: "Comfort Furniture Co.",
    lastUpdated: new Date("2023-06-10").toISOString()
  },
  {
    id: 3,
    name: "Wireless Mouse",
    category: "Electronics",
    quantity: 4,
    price: 29.99,
    threshold: 10,
    supplier: "Tech Solutions Inc.",
    lastUpdated: new Date("2023-06-15").toISOString()
  },
  {
    id: 4,
    name: "Desk Lamp",
    category: "Lighting",
    quantity: 12,
    price: 34.99,
    threshold: 5,
    supplier: "Lightning Fixtures Ltd.",
    lastUpdated: new Date("2023-06-07").toISOString()
  },
  {
    id: 5,
    name: "Printer Paper",
    category: "Office Supplies",
    quantity: 32,
    price: 9.99,
    threshold: 15,
    supplier: "Office Essentials",
    lastUpdated: new Date("2023-06-12").toISOString()
  },
  {
    id: 6,
    name: "Ink Cartridge",
    category: "Office Supplies",
    quantity: 0,
    price: 24.99,
    threshold: 8,
    supplier: "Office Essentials",
    lastUpdated: new Date("2023-06-05").toISOString()
  },
  {
    id: 7,
    name: "Monitor",
    category: "Electronics",
    quantity: 7,
    price: 249.99,
    threshold: 3,
    supplier: "Tech Solutions Inc.",
    lastUpdated: new Date("2023-06-03").toISOString()
  },
  {
    id: 8,
    name: "Desk",
    category: "Furniture",
    quantity: 5,
    price: 199.99,
    threshold: 2,
    supplier: "Comfort Furniture Co.",
    lastUpdated: new Date("2023-06-02").toISOString()
  }
];

// Create a class to manage inventory operations
class InventoryManager {
  constructor(initialItems = []) {
    // Use local storage if available, otherwise use the provided initial items
    this.items = this.loadFromLocalStorage() || [...initialItems];
    this.saveToLocalStorage();
  }

  // Load inventory from localStorage if available
  loadFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const storedItems = localStorage.getItem('inventoryItems');
      return storedItems ? JSON.parse(storedItems) : null;
    }
    return null;
  }

  // Save current inventory to localStorage
  saveToLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('inventoryItems', JSON.stringify(this.items));
    }
  }

  // Get all inventory items
  getAllItems() {
    return [...this.items];
  }

  // Get a specific item by ID
  getItemById(id) {
    return this.items.find(item => item.id === id);
  }

  // Add a new item to inventory
  addItem(item) {
    // Generate a new ID (max existing ID + 1)
    const newId = this.items.length > 0 
      ? Math.max(...this.items.map(i => i.id)) + 1 
      : 1;
    
    const newItem = {
      ...item,
      id: newId,
      lastUpdated: new Date().toISOString()
    };
    
    this.items.push(newItem);
    this.saveToLocalStorage();
    return newItem;
  }

  // Update an existing item
  updateItem(updatedItem) {
    const index = this.items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      this.items[index] = {
        ...updatedItem,
        lastUpdated: new Date().toISOString()
      };
      this.saveToLocalStorage();
      return this.items[index];
    }
    return null;
  }

  // Delete an item by ID
  deleteItem(id) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    const deleted = this.items.length < initialLength;
    if (deleted) {
      this.saveToLocalStorage();
    }
    return deleted;
  }

  // Get items that are out of stock (quantity = 0)
  getOutOfStockItems() {
    return this.items.filter(item => item.quantity === 0);
  }

  // Get items that are low in stock (below threshold but not zero)
  getLowStockItems() {
    return this.items.filter(item => item.quantity > 0 && item.quantity <= item.threshold);
  }

  // Get inventory statistics
  getInventoryStats() {
    const totalItems = this.items.length;
    const totalValue = this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const outOfStock = this.getOutOfStockItems().length;
    const lowStock = this.getLowStockItems().length;
    
    // Calculate items by category
    const categories = {};
    this.items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category] += item.quantity;
    });
    
    return {
      totalItems,
      totalValue,
      outOfStock,
      lowStock,
      categories
    };
  }

  // Filter items by various criteria
  filterItems({ searchTerm = '', category = '', stockStatus = 'all' }) {
    return this.items.filter(item => {
      // Filter by search term (name or supplier)
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = !category || item.category === category;
      
      // Filter by stock status
      let matchesStockStatus = true;
      if (stockStatus === 'out') {
        matchesStockStatus = item.quantity === 0;
      } else if (stockStatus === 'low') {
        matchesStockStatus = item.quantity > 0 && item.quantity <= item.threshold;
      } else if (stockStatus === 'normal') {
        matchesStockStatus = item.quantity > item.threshold;
      }
      
      return matchesSearch && matchesCategory && matchesStockStatus;
    });
  }
}

// Create and export the inventory manager instance
export const inventoryManager = new InventoryManager(initialInventoryData);

// Export helper functions that utilize the inventory manager
export const getInventoryItems = () => inventoryManager.getAllItems();
export const getItemById = (id) => inventoryManager.getItemById(id);
export const addInventoryItem = (item) => inventoryManager.addItem(item);
export const updateInventoryItem = (item) => inventoryManager.updateItem(item);
export const deleteInventoryItem = (id) => inventoryManager.deleteItem(id);
export const getInventoryStats = () => inventoryManager.getInventoryStats();
export const getOutOfStockItems = () => inventoryManager.getOutOfStockItems();
export const getLowStockItems = () => inventoryManager.getLowStockItems();
export const filterInventoryItems = (filters) => inventoryManager.filterItems(filters);

// Helper to get all unique categories
export const getCategories = () => {
  const items = inventoryManager.getAllItems();
  const categories = new Set(items.map(item => item.category));
  return Array.from(categories);
};