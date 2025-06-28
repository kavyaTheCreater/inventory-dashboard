# Project Summary
This project is a web application designed to provide an inventory management and analytics dashboard. Built with React, TypeScript, and Tailwind CSS, it offers a user-friendly interface for managing inventory data, visualizing statistics, and enhancing decision-making processes. The application utilizes the Shadcn-UI template for a cohesive design and rapid development.

# Project Module Description
The project consists of two main modules:
1. **Dashboard Module**: Displays inventory data with various charts and statistics, enabling users to manage inventory items effectively.
2. **Shadcn-UI Module**: A library of reusable UI components that enhances the application's interface and user experience.

# Directory Tree
```
dashboard/
  ├── README.md          # Project overview and setup instructions
  ├── index.html        # Main HTML file for the dashboard
  ├── src/              # Source files for the dashboard application
  ├── package.json       # Dependencies and scripts for the dashboard
  └── ...                # Other configuration and data files

shadcn-ui/
  ├── README.md          # Overview of the Shadcn-UI components
  ├── src/              # Source files for Shadcn-UI components
  ├── package.json       # Dependencies for the Shadcn-UI library
  └── ...                # Other configuration files
```

# File Description Inventory
- **dashboard/README.md**: Documentation on the dashboard setup and features.
- **dashboard/src/App.jsx**: Main application component for the dashboard.
- **dashboard/src/components/**: Contains all reusable components for the dashboard, including:
  - **Header.jsx**: Application header component.
  - **Sidebar.jsx**: Navigation sidebar component.
  - **Dashboard.jsx**: Main dashboard view.
  - **inventory/**: Contains components specific to inventory management:
    - **InventoryDashboard.jsx**: Dashboard for inventory overview.
    - **InventoryList.jsx**: Displays a list of inventory items.
    - **ItemForm.jsx**: Form for adding or editing inventory items.
    - **InventoryStats.jsx**: Displays inventory statistics.
- **dashboard/src/data/**: Contains mock data used for development and testing, including:
  - **inventoryData.js**: Data source for inventory items.
- **shadcn-ui/src/**: Contains all the UI components provided by the Shadcn-UI template.

# Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Build Tools**: Vite
- **Linting**: ESLint
- **Styling**: PostCSS

# Usage
1. Install dependencies using the package manager.
2. Build the project using the provided scripts.
3. Run the application locally.
