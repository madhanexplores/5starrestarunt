const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Enable CORS for all origins
app.use(cors({
    origin: 'https://kpmrestaurant.vercel.app' // Allow requests from your Vercel domain
}));

// Middleware to parse JSON data
app.use(express.json());

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
const orders = [];

// Route to handle order submission
app.post('/api/order', (req, res) => {
    const { chair, order } = req.body;

    console.log('Received POST request to /api/order');
    console.log('Chair:', chair);
    console.log('Order:', order);

    if (!chair || !order) {
        return res.status(400).json({ message: 'Invalid order' });
    }

    const totalAmount = calculateTotal(order); // Calculate total amount

    // Store the order in the orders array
    orders.push({ chair, order, totalAmount, time: new Date(), status: 'Pending' });
    res.json({ message: `Order received successfully from chair ${chair}`, order, totalAmount });
});

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

// Route to retrieve orders
app.get('/api/orders', (req, res) => {
    console.log('GET request to /api/orders received');
    try {
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to finish an order
app.post('/api/finish-order/:chair', (req, res) => {
    const chair = parseInt(req.params.chair);
    const order = orders.find(o => o.chair === chair && o.status === 'Pending');

    if (order) {
        order.status = 'Finished';
        res.json({ message: `Order from chair ${chair} has been finished.` });
    } else {
        res.status(404).json({ message: 'Order not found or already finished.' });
    }
});

// Route to clear all orders
app.delete('/api/clear-orders', (req, res) => {
    orders.length = 0; // Clear the orders array
    res.json({ message: 'All orders have been cleared.' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); // Log server URL
});
