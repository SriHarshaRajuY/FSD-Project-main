const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const app = express();

// Increase payload size limit to handle image uploads (e.g., 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database setup
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) console.error('Database connection error:', err.message);
    console.log('Connected to the SQLite database.');
});

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    if (req.path.startsWith('/api/') || req.path === '/addproduct') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.redirect('/login');
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Admin') return next();
    if (req.path.startsWith('/api/')) {
        return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    res.status(403).send('Access denied: Admin privileges required');
};

const isSeller = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Seller') return next();
    if (req.path.startsWith('/api/') || req.path === '/addproduct') {
        return res.status(403).json({ message: 'Access denied: Seller privileges required' });
    }
    res.status(403).send('Access denied: Seller privileges required');
};

const isExpert = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Expert') return next();
    if (req.path.startsWith('/api/')) {
        return res.status(403).json({ message: 'Access denied: Expert privileges required' });
    }
    res.status(403).send('Access denied: Expert privileges required');
};

// Initialize database with tables and default data
async function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Drop existing tables (for testing purposes; remove in production)
            db.run('DROP TABLE IF EXISTS users', (err) => {
                if (err) console.error('Error dropping users table:', err);
            });
            db.run('DROP TABLE IF EXISTS products', (err) => {
                if (err) console.error('Error dropping products table:', err);
            });
            db.run('DROP TABLE IF EXISTS tickets', (err) => {
                if (err) console.error('Error dropping tickets table:', err);
            });

            // Create users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                role TEXT,
                expertise TEXT,
                email TEXT UNIQUE,
                mobile TEXT UNIQUE
            )`, (err) => {
                if (err) return reject(err);

                // Insert default users
                const defaultUsers = [
                    ['admin', 'admin123', 'Admin', null, 'admin@example.com', '1234567890'],
                    ['seller1', 'seller123', 'Seller', null, 'seller1@example.com', '2345678901'],
                    ['buyer1', 'buyer123', 'Buyer', null, 'buyer1@example.com', '3456789012'],
                    ['admin2', 'admin456', 'Admin', null, 'admin2@example.com', '4567890123'],
                    ['seller2', 'seller789', 'Seller', null, 'seller2@example.com', '5678901234'],
                    ['seller3', 'seller101', 'Seller', null, 'seller3@example.com', '6789012345'],
                    ['buyer2', 'buyer456', 'Buyer', null, 'buyer2@example.com', '7890123456'],
                    ['buyer3', 'buyer789', 'Buyer', null, 'buyer3@example.com', '8901234567'],
                    ['delivery1', 'delivery123', 'Delivery Manager', null, 'delivery1@example.com', '9012345678'],
                    ['expert1', 'expert123', 'Expert', 'General', 'expert1@example.com', '0123456789'],
                    ['expert2', 'expert456', 'Expert', 'Technical', 'expert2@example.com', '1234509876'],
                    ['expert3', 'expert789', 'Expert', 'Billing', 'expert3@example.com', '2345098761']
                ];

                let completedUsers = 0;
                defaultUsers.forEach(([username, password, role, expertise, email, mobile]) => {
                    db.run('INSERT OR IGNORE INTO users (username, password, role, expertise, email, mobile) VALUES (?, ?, ?, ?, ?, ?)',
                        [username, password, role, expertise, email, mobile], (err) => {
                            if (err) console.error('Error inserting user:', err);
                            completedUsers++;
                            if (completedUsers === defaultUsers.length) {
                                console.log('Default users inserted');
                            }
                        });
                });

                // Create products table
                db.run(`CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    description TEXT,
                    price REAL,
                    category TEXT,
                    image TEXT,
                    seller_id INTEGER,
                    quantity INTEGER DEFAULT 0,
                    sold INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    sold_at TIMESTAMP,
                    FOREIGN KEY (seller_id) REFERENCES users(id)
                )`, (err) => {
                    if (err) return reject(err);

                    // Insert default products (8 initial products)
                    const defaultProducts = [
                        ['Money Plant Golden', 'A beautiful low-maintenance plant that brings prosperity.', 10.00, 'Plants', './public/images/new-products/p6.jpg', 2, 20, 15],
                        ['Growing round Plastic pot', 'Durable plastic pot perfect for small plants.', 10.00, 'Pots', './public/images/new-products/p7.jpg', 2, 15, 12],
                        ['Spinach Seeds', 'High-quality seeds for growing fresh spinach.', 5.00, 'Seeds', './public/images/new-products/p5.jpg', 2, 50, 30],
                        ['Pruning Secateur', 'Sharp tool for precise plant pruning.', 10.00, 'Tools', './public/images/new-products/p1.jpg', 2, 0, 8],
                        ['Onex Pebbles - 1Kg', 'Decorative pebbles for garden aesthetics.', 10.00, 'Pebbles', './public/images/new-products/p3.jpg', 2, 30, 25],
                        ['Parijat Tree', 'Fragrant flowering tree for your garden.', 10.00, 'Plants', './public/images/new-products/p4.jpg', 2, 10, 5],
                        ['Fungo Gaurd - 500ml', 'Fungicide to protect plants from fungal diseases.', 10.00, 'Fertilizers', './public/images/new-products/p2.jpg', 2, 25, 20],
                        ['Coco Husk Block - 5kg', 'Natural growing medium for healthy plants.', 10.00, 'Fertilizers', './public/images/new-products/p8.jpg', 2, 12, 10]
                    ];

                    let completedProducts = 0;
                    defaultProducts.forEach(([name, description, price, category, image, seller_id, quantity, sold]) => {
                        // Generate a random number of days (0-30) for the sold_at date
                        const randomDays = Math.floor(Math.random() * 30);
                        const soldAtDate = new Date();
                        soldAtDate.setDate(soldAtDate.getDate() - randomDays);
                        
                        db.run('INSERT OR IGNORE INTO products (name, description, price, category, image, seller_id, quantity, sold, sold_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [name, description, price, category, image, seller_id, quantity, sold, soldAtDate.toISOString()], (err) => {
                                if (err) console.error('Error inserting product:', err);
                                completedProducts++;
                                if (completedProducts === defaultProducts.length) {
                                    console.log('Default products inserted');
                                }
                            });
                    });

                    // Create tickets table
                    db.run(`CREATE TABLE IF NOT EXISTS tickets (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        requester TEXT,
                        subject TEXT,
                        type TEXT,
                        description TEXT,
                        status TEXT DEFAULT 'Open',
                        expert_id INTEGER,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (expert_id) REFERENCES users(id)
                    )`, (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
        });
    });
}

// Registration route
app.post('/register', (req, res) => {
    const { username, password, role, email, mobile } = req.body;

    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    if (!usernameRegex.test(username)) {
        return res.status(400).render('register', { 
            error: 'Username must be 3-20 characters (letters, numbers, _, - only)',
            user: null
        });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).render('register', { 
            error: 'Password must be 8+ characters with at least 1 uppercase, 1 number, and 1 symbol',
            user: null
        });
    }

    if (!['Buyer', 'Seller', 'Admin'].includes(role)) {
        return res.status(400).render('register', { 
            error: 'Invalid role selected',
            user: null
        });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).render('register', { 
            error: 'Invalid email format',
            user: null
        });
    }

    if (!mobileRegex.test(mobile)) {
        return res.status(400).render('register', { 
            error: 'Mobile number must be exactly 10 digits',
            user: null
        });
    }

    db.run(
        `INSERT INTO users (username, password, role, email, mobile) VALUES (?, ?, ?, ?, ?)`,
        [username, password, role, email, mobile],
        function(err) {
            if (err) {
                console.error('Registration error:', err);
                return res.status(400).render('register', { 
                    error: 'Username, email, or mobile already exists',
                    user: null
                });
            }
            res.redirect('/login');
        }
    );
});

// Login route
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;

    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
        if (err) {
            console.error('Login database error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (!user) return res.status(401).render('login', { error: 'Invalid username or password' });
        if (user.role.toLowerCase() !== role.toLowerCase()) {
            return res.status(401).render('login', { error: 'Role mismatch' });
        }

        req.session.user = user;
        console.log(`User logged in: ${username}, Role: ${role}, ID: ${user.id}`);

        switch (user.role) {
            case 'Expert':
                return res.redirect('/expert-dashboard');
            case 'Seller':
                return res.redirect('/seller');
            case 'Buyer':
                return res.redirect('/');
            case 'Admin':
                return res.redirect('/admindashboard');
            case 'Delivery Manager':
                return res.redirect('/deliverymanager');
            default:
                return res.redirect('/');
        }
    });
});

// Product routes
app.post('/addproduct', isAuthenticated, isSeller, (req, res) => {
    const { name, price, quantity, image, description } = req.body;
    const seller_id = req.session.user.id;
    const category = 'General';

    console.log('Received product data:', { name, price, quantity, image, description });

    if (!name || !price || !quantity || !image) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const quantityInt = parseInt(quantity);
    if (isNaN(quantityInt) || quantityInt < 0) {
        return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    const priceFloat = parseFloat(price);
    if (isNaN(priceFloat) || priceFloat < 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
    }

    db.run(
        `INSERT INTO products (name, description, price, category, image, seller_id, quantity, sold) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
        [name, description || `This is a ${name}. It is a high-quality product perfect for your garden.`,
         priceFloat, category, image, seller_id, quantityInt],
        function (err) {
            if (err) {
                console.error('Error adding product:', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            res.status(201).json({
                message: 'Product added successfully',
                product: {
                    id: this.lastID,
                    name,
                    price: priceFloat,
                    image,
                    quantity: quantityInt,
                    sold: 0,
                    description: description || `This is a ${name}. It is a high-quality product perfect for your garden.`,
                    type: 'recent'
                }
            });
        }
    );
});

app.put('/api/products/:id', isAuthenticated, isSeller, (req, res) => {
    const { name, price, quantity, description } = req.body;
    const productId = req.params.id;
    const seller_id = req.session.user.id;

    if (!name || !price || !quantity || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const priceFloat = parseFloat(price);
    const quantityInt = parseInt(quantity);

    if (isNaN(priceFloat) || priceFloat < 0 || isNaN(quantityInt) || quantityInt < 0) {
        return res.status(400).json({ message: 'Price and quantity must be positive numbers' });
    }

    db.run(
        `UPDATE products SET name = ?, price = ?, quantity = ?, description = ? 
         WHERE id = ? AND seller_id = ?`,
        [name, priceFloat, quantityInt, description, productId, seller_id],
        function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Product not found or not owned by seller' });
            }
            res.json({ message: 'Product updated successfully' });
        }
    );
});

app.delete('/api/products/:id', isAuthenticated, isSeller, (req, res) => {
    const productId = req.params.id;
    const seller_id = req.session.user.id;

    db.run(
        `DELETE FROM products WHERE id = ? AND seller_id = ?`,
        [productId, seller_id],
        function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Product not found or not owned by seller' });
            }
            res.json({ message: 'Product deleted successfully' });
        }
    );
});

// Ticket routes
app.post('/submit-ticket', (req, res) => {
    const { requester, subject, type, description } = req.body;

    if (!requester || !subject || !type || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const expertiseMap = {
        'general': 'General',
        'technical': 'Technical',
        'billing': 'Billing'
    };

    const expertise = expertiseMap[type.toLowerCase()];
    db.get('SELECT id FROM users WHERE role = "Expert" AND expertise = ?', [expertise], (err, expert) => {
        if (err) {
            console.error('Error finding expert:', err);
            return res.status(500).json({ message: 'Server error finding expert' });
        }
        if (!expert) {
            return res.status(500).json({ message: 'No expert available for this type' });
        }

        db.run(
            `INSERT INTO tickets (requester, subject, type, description, expert_id) VALUES (?, ?, ?, ?, ?)`,
            [requester, subject, type, description, expert.id],
            function (err) {
                if (err) {
                    console.error('Error submitting ticket:', err);
                    return res.status(500).json({ message: 'Server error saving ticket' });
                }
                res.status(201).json({ message: 'Ticket submitted successfully', ticketId: this.lastID });
            }
        );
    });
});

// Expert dashboard and API routes
app.get('/expert-dashboard', isAuthenticated, isExpert, (req, res) => {
    const expertId = req.session.user.id;
    db.all('SELECT * FROM tickets WHERE expert_id = ?', [expertId], (err, tickets) => {
        if (err) {
            console.error('Error fetching tickets:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        res.render('expert_dashboard', { user: req.session.user, tickets: tickets || [] });
    });
});

app.get('/api/tickets', isAuthenticated, isExpert, (req, res) => {
    const expertId = req.session.user.id;
    db.all('SELECT * FROM tickets WHERE expert_id = ?', [expertId], (err, tickets) => {
        if (err) {
            console.error('API: Error fetching tickets:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        res.json(tickets || []);
    });
});

// NEW ADMIN API ROUTES
// API to fetch all users
app.get('/api/users', isAuthenticated, isAdmin, (req, res) => {
    db.all('SELECT id, username, role, email, mobile FROM users', [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        res.json(rows);
    });
});

// API to update user role
app.put('/api/users/:id', isAuthenticated, isAdmin, (req, res) => {
    const { role } = req.body;
    const userId = req.params.id;
    db.run('UPDATE users SET role = ? WHERE id = ?', [role, userId], function(err) {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (this.changes === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully' });
    });
});

// API to delete user
app.delete('/api/users/:id', isAuthenticated, isAdmin, (req, res) => {
    const userId = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (this.changes === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    });
});

// API to fetch all products
app.get('/api/products', isAuthenticated, isAdmin, (req, res) => {
    db.all('SELECT id, name, price, quantity, seller_id FROM products', [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        res.json(rows);
    });
});

// API to fetch all tickets (for admin)
app.get('/api/tickets/all', isAuthenticated, isAdmin, (req, res) => {
    db.all('SELECT * FROM tickets', [], (err, rows) => {
        if (err) {
            console.error('Error fetching tickets:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        res.json(rows);
    });
});

// API to update ticket status
app.put('/api/tickets/:id', isAuthenticated, isAdmin, (req, res) => {
    const { status } = req.body;
    const ticketId = req.params.id;
    db.run('UPDATE tickets SET status = ? WHERE id = ?', [status, ticketId], function(err) {
        if (err) {
            console.error('Error updating ticket:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (this.changes === 0) return res.status(404).json({ message: 'Ticket not found' });
        res.json({ message: 'Ticket updated successfully' });
    });
});

// API to fetch top sales for a seller
app.get('/api/top-sales', isAuthenticated, isSeller, (req, res) => {
    const sellerId = req.session.user.id;
    db.all(`
        SELECT * FROM products 
        WHERE seller_id = ? AND sold > 0 
        ORDER BY sold DESC 
        LIMIT 5
    `, [sellerId], (err, products) => {
        if (err) {
            console.error('Error fetching top sales:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        res.json(products.map(p => ({
            id: p.id,
            name: p.name,
            price: `$${p.price.toFixed(2)}`,
            image: p.image,
            quantity: p.quantity,
            sold: p.sold,
            description: p.description,
            type: 'top'
        })));
    });
});

// General routes
app.get('/', (req, res) => {
    db.all('SELECT * FROM products ORDER BY id DESC', [], (err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).render('homepage', { 
                user: req.session.user || null,
                newProducts: [],
                bestProducts: []
            });
        }

        // Limit to 8 most recent products using slice
        const recentProducts = products.slice(0, 8);
        
        const formattedNewProducts = recentProducts.map((product) => ({
            id: product.id,
            name: product.name,
            image: product.image,
            rating: 4.5,
            price: product.price,
            originalPrice: product.price * 1.45,
            description: product.description,
            inStock: product.quantity > 0,
            available: product.quantity
        }));

        const bestProducts = [
            { id: 1, name: "Bonsai", image: "/public/images/best-products/s1.jpg" },
            { id: 2, name: "Indoor", image: "/public/images/best-products/s2.jpg" },
            { id: 3, name: "Areca Palm", image: "/public/images/best-products/s3.jpg" },
            { id: 4, name: "Seeds", image: "/public/images/best-products/s4.jpg" }
        ];

        res.render('homepage', { 
            user: req.session.user || null,
            newProducts: formattedNewProducts.length > 0 ? formattedNewProducts : [],
            bestProducts: bestProducts
        });
    });
});

app.get('/seeds', (req, res) => res.render('seeds', { user: req.session.user || null }));
app.get('/register', (req, res) => res.render('register', { user: req.session.user || null, error: null }));
app.get('/pots', (req, res) => res.render('pots', { user: req.session.user || null }));
app.get('/plants', (req, res) => res.render('plants', { user: req.session.user || null }));
app.get('/pebbles', (req, res) => res.render('pebbles', { user: req.session.user || null }));
app.get('/tools', (req, res) => res.render('tools', { user: req.session.user || null }));
app.get('/login', (req, res) => res.render('login', { error: null }));
app.get('/fertilizers', (req, res) => res.render('fertilizers', { user: req.session.user || null }));
app.get('/expert_support', (req, res) => res.render('expert_support', { user: req.session.user || null }));
app.get('/cart', (req, res) => res.render('cart', { user: req.session.user || null }));
app.get('/beforeseller', (req, res) => res.render('beforeseller', { user: req.session.user || null }));

app.get('/seller', isAuthenticated, isSeller, (req, res) => {
    db.all('SELECT * FROM products WHERE seller_id = ?', [req.session.user.id], (err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        const initialProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            price: `$${p.price.toFixed(2)}`,
            image: p.image,
            quantity: p.quantity,
            sold: p.sold,
            description: p.description,
            type: 'recent'
        }));
        res.render('seller', { user: req.session.user, initialProducts: initialProducts || [] });
    });
});

app.get('/api/recent-sales', isAuthenticated, isSeller, (req, res) => {
    db.all('SELECT * FROM products WHERE seller_id = ? ORDER BY id DESC LIMIT 5', 
        [req.session.user.id], (err, products) => {
            if (err) {
                console.error('Error fetching recent sales:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            res.json(products.map(p => ({
                id: p.id,
                name: p.name,
                price: `$${p.price.toFixed(2)}`,
                image: p.image,
                quantity: p.quantity,
                sold: p.sold,
                description: p.description,
                type: 'recent'
            })));
        });
});

// Blog routes
app.get('/article1', (req, res) => res.render('blogs/article1', { user: req.session.user || null }));
app.get('/article2', (req, res) => res.render('blogs/article2', { user: req.session.user || null }));
app.get('/article3', (req, res) => res.render('blogs/article3', { user: req.session.user || null }));
app.get('/article4', (req, res) => res.render('blogs/article4', { user: req.session.user || null }));
app.get('/basics', (req, res) => res.render('blogs/basics', { user: req.session.user || null }));
app.get('/blog', (req, res) => res.render('blogs/blog', { user: req.session.user || null }));
app.get('/kitchen', (req, res) => res.render('blogs/kitchen', { user: req.session.user || null }));
app.get('/maintenance', (req, res) => res.render('blogs/maintenance', { user: req.session.user || null }));

// Protected dashboard routes
app.get('/admindashboard', isAuthenticated, isAdmin, (req, res) => {
    res.render('admindashboard', { user: req.session.user || null });
});

// Seller Dashboard route
app.get('/sellerdashboard', isSeller, (req, res) => {
    const sellerId = req.session.user.id;
    
    // Get seller's products
    db.all('SELECT * FROM products WHERE seller_id = ?', [sellerId], (err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error loading dashboard');
        }

        // Calculate dashboard metrics
        const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.sold), 0);
        const totalProducts = products.length;
        const totalSales = products.reduce((sum, product) => sum + product.sold, 0);
        const activeProducts = products.filter(product => product.quantity > 0).length;

        // Get top sales data
        const topSales = products
            .filter(product => product.sold > 0)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5)
            .map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity,
                sold: product.sold,
                description: product.description,
                type: 'recent'
            }));

        // Get sales data for charts
        db.all(`
            WITH RECURSIVE months AS (
                SELECT date('now', '-11 months') as month
                UNION ALL
                SELECT date(month, '+1 month')
                FROM months
                WHERE month < date('now')
            ),
            monthly_revenue AS (
                SELECT 
                    strftime('%Y-%m', COALESCE(sold_at, CURRENT_TIMESTAMP)) as month,
                    SUM(price * sold) as revenue
                FROM products 
                WHERE seller_id = ? AND sold > 0
                GROUP BY month
            )
            SELECT 
                m.month,
                COALESCE(mr.revenue, 0) as revenue
            FROM months m
            LEFT JOIN monthly_revenue mr ON m.month = mr.month
            ORDER BY m.month ASC
        `, [sellerId], (err, revenueData) => {
            if (err) {
                console.error('Error fetching revenue data:', err);
                return res.status(500).send('Error loading dashboard');
            }

            // Get category-wise sales data
            db.all(`
                SELECT 
                    category,
                    SUM(price * sold) as revenue,
                    COUNT(*) as count
                FROM products 
                WHERE seller_id = ? AND sold > 0
                GROUP BY category
            `, [sellerId], (err, categoryData) => {
                if (err) {
                    console.error('Error fetching category data:', err);
                    return res.status(500).send('Error loading dashboard');
                }

                res.render('sellerdashboard', {
                    user: req.session.user,
                    products,
                    metrics: {
                        totalRevenue,
                        totalProducts,
                        totalSales,
                        activeProducts
                    },
                    revenueData,
                    categoryData,
                    topSales: topSales.length > 0 ? topSales : [] // Pass top sales data to the template
                });
            });
        });
    });
});

app.get('/deliverymanagerdashboard', (req, res) => {
    const data = {
        currentPage: 'dashboard',
        user: { name: 'Pardhuva' },
        metrics: { pendingDeliveries: 24, pendingChange: -15, inTransit: 18, inTransitChange: 12, deliveredToday: 32, deliveredChange: 28, activeAgents: 8 },
        recentOrders: [
            { id: '#ORD-001', customer: 'Pardhuva', address: '123 Garden St', agent: 'Alex Johnson', status: 'delivered' },
            { id: '#ORD-002', customer: 'Sri harsha', address: '456 Plant Ave', agent: 'Michael Brown', status: 'in-transit' }
        ],
        chartData: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], data: [12, 19, 3, 5, 2, 3, 10] }
    };
    res.render('dashboard', { ...data, user: req.session.user || null });
});

app.get('/deliverymanager', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Delivery Manager') {
        return res.status(403).send('Access denied: Only Delivery Managers can access this page');
    }
    res.render('deliverymanager', { user: req.session.user || null });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Something went wrong!' });
        }
        res.redirect('/login');
    });
});

// Authentication check route (for client-side validation)
app.get('/api/check-auth', (req, res) => {
    res.json({ isAuthenticated: !!req.session.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 7000;
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });
