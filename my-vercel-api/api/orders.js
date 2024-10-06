// api/orders.js
export default function handler(req, res) {
    if (req.method === 'GET') {
        // Handle GET requests
        res.status(200).json({ message: 'Fetching orders...' });
    } else if (req.method === 'POST') {
        // Handle POST requests
        const { chair, order } = req.body;
        
        // Here you can process the order, e.g., save it to a database or an array
        // For demo purposes, we'll just return the received order
        res.status(201).json({ message: `Order received from chair ${chair}`, order });
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
const express = require('express');
const app = express();

app.use(express.json());

let orders = []; // Temporary storage for orders

// Endpoint to handle new orders
app.post('/orders', (req, res) => {
    const { chair, order } = req.body;
    if (!chair || !order) {
        return res.status(400).send('Invalid order');
    }
    orders.push({ chair, order, status: 'Pending', time: new Date() });
    res.status(201).json({ message: 'Order received' });
});

// Endpoint to fetch orders
app.get('/orders', (req, res) => {
    res.json(orders);
});

// Endpoint to clear orders
app.delete('/clear-orders', (req, res) => {
    orders = [];
    res.send('All orders cleared');
});

module.exports = app;
// api/orders.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { chair, order } = req.body;

        console.log(`Received order from chair ${chair}: ${order}`);

        if (!chair || !order) {
            return res.status(400).json({ message: 'Invalid order' });
        }

        // Process the order and respond
        res.status(200).json({ message: 'Order received successfully!' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
app.post('/order', (req, res) => {
    const { chair, order } = req.body;

    // Log the incoming order
    console.log(`Received order from chair ${chair}: ${order}`);

    if (!chair || !order) {
        return res.status(400).json({ message: 'Invalid order' });
    }

    // Proceed with processing the order
    // ...
});
