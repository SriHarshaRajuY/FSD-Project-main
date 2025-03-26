// database.js
const users = [
    { username: 'admin', password: 'admin123', role: 'Admin', expertise: null },
    { username: 'seller1', password: 'seller123', role: 'Seller', expertise: null },
    { username: 'buyer1', password: 'buyer123', role: 'Buyer', expertise: null },
    { username: 'admin2', password: 'admin456', role: 'Admin', expertise: null },
    { username: 'seller2', password: 'seller789', role: 'Seller', expertise: null },
    { username: 'seller3', password: 'seller101', role: 'Seller', expertise: null },
    { username: 'buyer2', password: 'buyer456', role: 'Buyer', expertise: null },
    { username: 'buyer3', password: 'buyer789', role: 'Buyer', expertise: null },
    { username: 'delivery1', password: 'delivery123', role: 'Delivery Manager', expertise: null },
    { username: 'expert1', password: 'expert123', role: 'Expert', expertise: 'General' },
    { username: 'expert2', password: 'expert456', role: 'Expert', expertise: 'Technical' },
    { username: 'expert3', password: 'expert789', role: 'Expert', expertise: 'Billing' }
];

module.exports = users;