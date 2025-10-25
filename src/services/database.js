// Database simulation using localStorage
export class InventDB {
    constructor() {
        this.initializeDB();
    }

    initializeDB() {
        if (!localStorage.getItem('inventDB')) {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            const initialDB = {
                settings: {
                    companyName: "FreshStock Grocery",
                    timezone: "UTC-8",
                    dateFormat: "MM/DD/YYYY",
                    currency: "INR",
                    lowStockThreshold: 10,
                    criticalStockThreshold: 5,
                    expiryDaysThreshold: 7,
                    notificationEmail: "admin@freshstock.com",
                    systemMessage: "Welcome to FreshStock! Please keep your inventory up to date."
                },
                users: [
                    {
                        id: 1,
                        username: "admin",
                        password: "admin123",
                        name: "Admin User",
                        role: "admin"
                    },
                    {
                        id: 2,
                        username: "karan",
                        password: "karan123",
                        name: "Inventory Manager",
                        role: "manager"
                    }
                ],
                products: [
                    {
                        id: 1,
                        name: "Fresh Apples",
                        sku: "FR-APP-RED",
                        category: "Fruits & Vegetables",
                        stock: 25,
                        unit: "kg",
                        price: 120,
                        expiryDate: "2024-06-20",
                        description: "Fresh red apples",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        name: "Milk",
                        sku: "DA-MILK-1L",
                        category: "Dairy & Eggs",
                        stock: 42,
                        unit: "bottle",
                        price: 60,
                        expiryDate: "2024-06-10",
                        description: "1L full cream milk",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 3,
                        name: "Chicken Breast",
                        sku: "ME-CHK-BRST",
                        category: "Meat & Poultry",
                        stock: 12,
                        unit: "kg",
                        price: 350,
                        expiryDate: "2024-06-05",
                        description: "Fresh chicken breast",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 4,
                        name: "White Bread",
                        sku: "BK-BRD-WHT",
                        category: "Bakery",
                        stock: 30,
                        unit: "pack",
                        price: 40,
                        expiryDate: "2024-06-03",
                        description: "Fresh white bread",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 5,
                        name: "Mineral Water",
                        sku: "BV-WTR-1L",
                        category: "Beverages",
                        stock: 0,
                        unit: "bottle",
                        price: 20,
                        expiryDate: "2025-01-01",
                        description: "1L mineral water",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 6,
                        name: "Oil",
                        sku: "OI-LK-DR",
                        category: "Household",
                        stock: 20,
                        unit: "bottle",
                        price: 152,
                        expiryDate: "2025-18-11",
                        description: "1L bottel",
                        createdAt: new Date().toISOString()
                    }

                ],
                suppliers: [
                    {
                        id: 1,
                        name: "Fresh Farms Produce",
                        contact: "Raj Sharma",
                        phone: "(555) 123-4567",
                        email: "raj@freshfarms.com",
                        category: "Fruits & Vegetables",
                        products: "Fruits, Vegetables",
                        status: "Active",
                        address: "123 Farm Road, Bangalore, India",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        name: "Dairy Delight",
                        contact: "Priya Patel",
                        phone: "(555) 987-6543",
                        email: "priya@dairydelight.com",
                        category: "Dairy & Eggs",
                        products: "Milk, Cheese, Yogurt, Eggs",
                        status: "Active",
                        address: "456 Dairy Lane, Mumbai, India",
                        createdAt: new Date().toISOString()
                    }
                ],
                orders: [
                    {
                        id: 1,
                        poNumber: "PO-10025",
                        supplierId: 1,
                        date: today, // Today's date
                        items: [
                            { productId: 1, quantity: 10, price: 110 },
                            { productId: 2, quantity: 5, price: 55 }
                        ],
                        status: "Received",
                        notes: "Received in good condition",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        poNumber: "PO-10026",
                        supplierId: 2,
                        date: today, // Today's date
                        items: [
                            { productId: 3, quantity: 8, price: 340 }
                        ],
                        status: "Pending",
                        notes: "Waiting for approval",
                        createdAt: new Date().toISOString()
                    }
                ],
                activities: [
                    {
                        id: 1,
                        date: new Date().toISOString(),
                        activity: "Product Added",
                        user: "Admin User",
                        details: "Added \"Fresh Oranges\" to inventory"
                    }
                ],
                sales: [
                    {
                        id: 1,
                        date: today, // Today's date
                        productId: 1,
                        quantity: 2,
                        amount: 240,
                        customer: "Retail Customer"
                    },
                    {
                        id: 2,
                        date: today, // Today's date
                        productId: 2,
                        quantity: 3,
                        amount: 180,
                        customer: "ABC Corporation"
                    },
                    {
                        id: 3,
                        date: yesterdayStr, // Yesterday's date
                        productId: 2,
                        quantity: 5,
                        amount: 300,
                        customer: "ABC Corporation"
                    },
                    {
                        id: 4,
                        date: yesterdayStr, // Yesterday's date
                        productId: 3,
                        quantity: 1,
                        amount: 350,
                        customer: "XYZ Enterprises"
                    }
                ]
            };

            localStorage.setItem('inventDB', JSON.stringify(initialDB));
        }
    }

    getDB() {
        return JSON.parse(localStorage.getItem('inventDB'));
    }

    updateDB(db) {
        localStorage.setItem('inventDB', JSON.stringify(db));
    }

    // User authentication methods
    getUsers() {
        const db = this.getDB();
        return db.users;
    }

    authenticateUser(username, password) {
        const users = this.getUsers();
        return users.find(user => user.username === username && user.password === password);
    }

    // Products CRUD
    getProducts() {
        const db = this.getDB();
        return db.products;
    }

    getProduct(id) {
        const db = this.getDB();
        return db.products.find(p => p.id === id);
    }

    addProduct(product) {
        const db = this.getDB();
        product.id = db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1;
        product.createdAt = new Date().toISOString();
        db.products.push(product);
        this.updateDB(db);
        return product;
    }

    updateProduct(id, productData) {
        const db = this.getDB();
        const index = db.products.findIndex(p => p.id === id);
        if (index !== -1) {
            db.products[index] = { ...db.products[index], ...productData };
            this.updateDB(db);
            return db.products[index];
        }
        return null;
    }

    deleteProduct(id) {
        const db = this.getDB();
        const index = db.products.findIndex(p => p.id === id);
        if (index !== -1) {
            db.products.splice(index, 1);
            this.updateDB(db);
            return true;
        }
        return false;
    }

    // Suppliers CRUD
    getSuppliers() {
        const db = this.getDB();
        return db.suppliers;
    }

    getSupplier(id) {
        const db = this.getDB();
        return db.suppliers.find(s => s.id === id);
    }

    addSupplier(supplier) {
        const db = this.getDB();
        supplier.id = db.suppliers.length > 0 ? Math.max(...db.suppliers.map(s => s.id)) + 1 : 1;
        supplier.createdAt = new Date().toISOString();
        db.suppliers.push(supplier);
        this.updateDB(db);
        return supplier;
    }

    updateSupplier(id, supplierData) {
        const db = this.getDB();
        const index = db.suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
            db.suppliers[index] = { ...db.suppliers[index], ...supplierData };
            this.updateDB(db);
            return db.suppliers[index];
        }
        return null;
    }

    deleteSupplier(id) {
        const db = this.getDB();
        const index = db.suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
            db.suppliers.splice(index, 1);
            this.updateDB(db);
            return true;
        }
        return false;
    }

    // Orders CRUD
    getOrders() {
        const db = this.getDB();
        return db.orders.map(order => {
            const supplier = this.getSupplier(order.supplierId);
            const total = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            return {
                ...order,
                supplierName: supplier ? supplier.name : 'Unknown Supplier',
                total: total
            };
        });
    }

    getOrder(id) {
        const db = this.getDB();
        const order = db.orders.find(o => o.id === id);
        if (order) {
            const supplier = this.getSupplier(order.supplierId);
            const total = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            return {
                ...order,
                supplierName: supplier ? supplier.name : 'Unknown Supplier',
                total: total
            };
        }
        return null;
    }

    addOrder(order) {
        const db = this.getDB();
        order.id = db.orders.length > 0 ? Math.max(...db.orders.map(o => o.id)) + 1 : 1;
        order.poNumber = `PO-${10000 + order.id}`;
        order.createdAt = new Date().toISOString();
        db.orders.push(order);
        this.updateDB(db);

        // Log activity
        this.addActivity({
            activity: "Purchase Order Created",
            user: "System",
            details: `Created purchase order ${order.poNumber}`
        });

        return order;
    }

    updateOrder(id, orderData) {
        const db = this.getDB();
        const index = db.orders.findIndex(o => o.id === id);
        if (index !== -1) {
            const oldOrder = db.orders[index];
            db.orders[index] = { ...db.orders[index], ...orderData };
            this.updateDB(db);

            // Log activity if status changed
            if (oldOrder.status !== orderData.status) {
                this.addActivity({
                    activity: "Order Status Updated",
                    user: "System",
                    details: `Order ${oldOrder.poNumber} status changed from ${oldOrder.status} to ${orderData.status}`
                });
            }

            return db.orders[index];
        }
        return null;
    }

    deleteOrder(id) {
        const db = this.getDB();
        const index = db.orders.findIndex(o => o.id === id);
        if (index !== -1) {
            const order = db.orders[index];
            db.orders.splice(index, 1);
            this.updateDB(db);
            return true;
        }
        return false;
    }

    // NEW: Update inventory when order is received
    receiveOrder(orderId) {
        const db = this.getDB();
        const order = db.orders.find(o => o.id === orderId);
        
        if (!order) {
            throw new Error('Order not found');
        }

        if (order.status === 'Received') {
            throw new Error('Order already received');
        }

        // Update product stock for each item in the order
        order.items.forEach(item => {
            const product = this.getProduct(item.productId);
            if (product) {
                product.stock += item.quantity;
            }
        });

        // Update order status
        order.status = 'Received';
        this.updateDB(db);

        // Log activity
        this.addActivity({
            activity: "Order Received",
            user: "System",
            details: `Received order ${order.poNumber} - inventory updated`
        });

        return order;
    }

    // Activities
    getActivities() {
        const db = this.getDB();
        return db.activities;
    }

    addActivity(activity) {
        const db = this.getDB();
        activity.id = db.activities.length > 0 ? Math.max(...db.activities.map(a => a.id)) + 1 : 1;
        activity.date = new Date().toISOString();
        db.activities.unshift(activity);
        this.updateDB(db);
        return activity;
    }

    // Settings
    getSettings() {
        const db = this.getDB();
        return db.settings;
    }

    updateSettings(settings) {
        const db = this.getDB();
        db.settings = { ...db.settings, ...settings };
        this.updateDB(db);
        return db.settings;
    }

    // Sales Methods
    getSales() {
        const db = this.getDB();
        return db.sales;
    }

    getMonthlySales() {
        const db = this.getDB();
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        return db.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getMonth() + 1 === currentMonth && saleDate.getFullYear() === currentYear;
        }).reduce((sum, sale) => sum + sale.amount, 0);
    }

    getTodaySales() {
        const db = this.getDB();
        const today = new Date().toISOString().split('T')[0];
        
        const todaySales = db.sales
            .filter(sale => sale.date === today)
            .reduce((sum, sale) => sum + sale.amount, 0);
        
        return todaySales;
    }

    // NEW: Record a sale and update inventory
    recordSale(productId, quantity, customer = "Retail Customer") {
        const db = this.getDB();
        const product = this.getProduct(productId);
        
        if (!product) {
            throw new Error('Product not found');
        }
        
        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }
        
        // Calculate amount
        const amount = product.price * quantity;
        
        // Create sale record
        const sale = {
            id: db.sales.length > 0 ? Math.max(...db.sales.map(s => s.id)) + 1 : 1,
            date: new Date().toISOString().split('T')[0],
            productId: productId,
            quantity: quantity,
            amount: amount,
            customer: customer
        };
        
        // Update product stock
        product.stock -= quantity;
        
        // Add sale to database
        db.sales.push(sale);
        this.updateDB(db);
        
        // Log activity
        this.addActivity({
            activity: "Sale Recorded",
            user: "System",
            details: `Sold ${quantity} ${product.unit} of ${product.name} to ${customer} for ₹${amount}`
        });
        
        return sale;
    }

    // Purchase Methods (NEW)
    getTodayPurchases() {
        const db = this.getDB();
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate total of today's received orders
        const todayOrders = db.orders.filter(order => 
            order.date === today && order.status === 'Received'
        );
        
        return todayOrders.reduce((sum, order) => {
            const orderTotal = order.items.reduce((orderSum, item) => 
                orderSum + (item.quantity * item.price), 0
            );
            return sum + orderTotal;
        }, 0);
    }

    getTodayPurchaseOrders() {
        const db = this.getDB();
        const today = new Date().toISOString().split('T')[0];
        return db.orders.filter(order => order.date === today);
    }

    getMonthlyPurchases() {
        const db = this.getDB();
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        return db.orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() + 1 === currentMonth && 
                   orderDate.getFullYear() === currentYear &&
                   order.status === 'Received';
        }).reduce((sum, order) => {
            const orderTotal = order.items.reduce((orderSum, item) => 
                orderSum + (item.quantity * item.price), 0
            );
            return sum + orderTotal;
        }, 0);
    }

    // Analytics Methods
    getTopProduct() {
        const db = this.getDB();
        const productSales = {};

        db.sales.forEach(sale => {
            if (!productSales[sale.productId]) {
                productSales[sale.productId] = 0;
            }
            productSales[sale.productId] += sale.quantity;
        });

        let topProductId = null;
        let maxSales = 0;

        for (const productId in productSales) {
            if (productSales[productId] > maxSales) {
                maxSales = productSales[productId];
                topProductId = parseInt(productId);
            }
        }

        if (topProductId) {
            const product = this.getProduct(topProductId);
            return {
                product: product ? product.name : 'Unknown Product',
                sales: maxSales
            };
        }

        return {
            product: 'No sales data',
            sales: 0
        };
    }

    getInventoryValue() {
        const products = this.getProducts();
        return products.reduce((sum, product) => sum + (product.stock * product.price), 0);
    }

    getAverageDailySales() {
        const sales = this.getSales();
        if (sales.length === 0) return 0;

        // Calculate average sales per day
        const salesByDate = {};
        sales.forEach(sale => {
            if (!salesByDate[sale.date]) {
                salesByDate[sale.date] = 0;
            }
            salesByDate[sale.date] += sale.amount;
        });

        const totalSales = Object.values(salesByDate).reduce((sum, amount) => sum + amount, 0);
        return totalSales / Object.keys(salesByDate).length;
    }

    getSalesGrowth() {
        const db = this.getDB();
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        const currentMonthSales = db.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getMonth() + 1 === currentMonth && saleDate.getFullYear() === currentYear;
        }).reduce((sum, sale) => sum + sale.amount, 0);

        const prevMonthSales = db.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getMonth() + 1 === prevMonth && saleDate.getFullYear() === prevYear;
        }).reduce((sum, sale) => sum + sale.amount, 0);

        if (prevMonthSales === 0) return currentMonthSales > 0 ? 100 : 0;
        return ((currentMonthSales - prevMonthSales) / prevMonthSales) * 100;
    }

    getSalesTrend() {
        const db = this.getDB();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const todaySales = db.sales
            .filter(sale => sale.date === today)
            .reduce((sum, sale) => sum + sale.amount, 0);

        const yesterdaySales = db.sales
            .filter(sale => sale.date === yesterdayStr)
            .reduce((sum, sale) => sum + sale.amount, 0);

        if (yesterdaySales === 0) return todaySales > 0 ? 100 : 0;
        return ((todaySales - yesterdaySales) / yesterdaySales) * 100;
    }

    getLowStockItems() {
        const db = this.getDB();
        const criticalThreshold = db.settings.criticalStockThreshold || 5;
        const lowThreshold = db.settings.lowStockThreshold || 10;

        return db.products.filter(product => product.stock <= lowThreshold).length;
    }

    getPendingOrders() {
        const db = this.getDB();
        return db.orders.filter(order => order.status === 'Pending').length;
    }

    getNewOrdersToday() {
        const db = this.getDB();
        const today = new Date().toISOString().split('T')[0];
        return db.orders.filter(order => order.date === today).length;
    }

    getProductsNearExpiry(daysThreshold = null) {
        const db = this.getDB();
        const threshold = daysThreshold || db.settings.expiryDaysThreshold || 7;
        const today = new Date();
        const thresholdDate = new Date();
        thresholdDate.setDate(today.getDate() + threshold);

        return db.products.filter(product => {
            if (!product.expiryDate) return false;

            const expiryDate = new Date(product.expiryDate);
            return expiryDate <= thresholdDate && expiryDate >= today;
        });
    }

    calculateDiscount(expiryDate) {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        // More discount as it gets closer to expiry
        if (daysRemaining <= 2) return 0.5; // 50% off
        if (daysRemaining <= 4) return 0.3; // 30% off
        if (daysRemaining <= 7) return 0.2; // 20% off
        return 0; // No discount
    }

    getSalesDataForChart() {
        const db = this.getDB();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();

        const monthlySales = Array(12).fill(0);

        db.sales.forEach(sale => {
            const saleDate = new Date(sale.date);
            if (saleDate.getFullYear() === currentYear) {
                monthlySales[saleDate.getMonth()] += sale.amount;
            }
        });

        return {
            labels: months,
            data: monthlySales
        };
    }

    getInventoryDataForChart() {
        const products = this.getProducts();
        const categories = {};

        products.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = 0;
            }
            categories[product.category] += product.stock * product.price;
        });

        return {
            labels: Object.keys(categories),
            data: Object.values(categories)
        };
    }

    // NEW: Get purchase data for chart
    getPurchaseDataForChart() {
        const db = this.getDB();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();

        const monthlyPurchases = Array(12).fill(0);

        db.orders.forEach(order => {
            if (order.status === 'Received') {
                const orderDate = new Date(order.date);
                if (orderDate.getFullYear() === currentYear) {
                    const orderTotal = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                    monthlyPurchases[orderDate.getMonth()] += orderTotal;
                }
            }
        });

        return {
            labels: months,
            data: monthlyPurchases
        };
    }
}

// Helper function to get week number
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}