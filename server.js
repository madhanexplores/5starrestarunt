const cors = require('cors');

// Prices of food items
const prices = {
    Biryani: 100,
    Parota: 10,
    "Tomato Rice": 50,
    Café: 12,
    Tea: 10,
    Juice: 20,
    "Ice Cream": 30,
    Pasta: 70
};

// Array to hold orders
let orders = [];

// Function to calculate total amount based on order
function calculateTotal(order) {
    const items = order.split(', ').map(item => {
        const [name, qty] = item.split(' (Qty: ');
        const quantity = qty ? parseInt(qty.replace(')', '')) : 1; // Default to 1 if not specified
        return { name: name.trim(), quantity }; // Trim whitespace
    });

    return items.reduce((total, item) => {
        const price = prices[item.name];
        if (price) {
            return total + (price * item.quantity);
        }
        return total; // Return the total if item not found
    }, 0);
}

// Handle POST request to /order
module.exports = (req, res) => {
    const { method } = req;

    if (method === 'POST') {
        const { chair, order } = req.body;

        if (!chair || !order) {
            return res.status(400).json({ message: 'Invalid order' });
        }

        const totalAmount = calculateTotal(order); // Calculate total amount

        // Store the order in the orders array
        orders.push({ chair, order, totalAmount, time: new Date(), status: 'Pending' });
        return res.status(200).json({ message: `Order received successfully from chair ${chair}`, order, totalAmount });
    }

    // Handle GET request to /orders
    else if (method === 'GET') {
        return res.status(200).json(orders);
    }

    // Handle POST request to finish an order
    else if (method === 'POST' && req.url.includes('/finish-order')) {
        const chair = parseInt(req.url.split('/finish-order/')[1]);
        const order = orders.find(o => o.chair === chair && o.status === 'Pending');

        if (order) {
            order.status = 'Finished';
            return res.status(200).json({ message: `Order from chair ${chair} has been finished.` });
        } else {
            return res.status(404).json({ message: 'Order not found or already finished.' });
        }
    }

    // Default response for unsupported methods
    else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
};
