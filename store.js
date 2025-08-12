const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

const dbPath = path.join('./storeDB.json');

// Helper: Read database
function readDB() {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
}

// Helper: Write to database
function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Helper: Parse quantity
function parseQuantity(quantityStr) {
    const num = parseFloat(quantityStr);
    return isNaN(num) ? 0 : num;
}

// Auto-increment ID
let currentId = (() => {
    const data = readDB();
    return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
})();

// CREATE
app.post('/groceries', (req, res) => {
    const { storeName, goods, unitPrice, quantity } = req.body;

    const quantityNum = parseQuantity(quantity);
    const priceNum = parseFloat(unitPrice);
    const totalPrice = (quantityNum * priceNum).toFixed(2);
    const isAvailable = quantityNum > 0;

    const newItem = {
        id: currentId++,
        storeName,
        goods,
        unitPrice,
        quantity,
        totalPrice,
        isAvailable
    };

    const db = readDB();
    db.push(newItem);
    writeDB(db);

    res.status(201).json(newItem);
});

// READ all
app.get('/groceries', (req, res) => {
    const db = readDB();
    res.json(db);
});

// READ by ID
app.get('/groceries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const db = readDB();
    const item = db.find(i => i.id === id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
});

// UPDATE
app.put('/groceries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { storeName, goods, unitPrice, quantity } = req.body;

    const db = readDB();
    const index = db.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ message: 'Item not found' });

    const quantityNum = parseQuantity(quantity);
    const priceNum = parseFloat(unitPrice);
    const totalPrice = (quantityNum * priceNum).toFixed(2);
    const isAvailable = quantityNum > 0;

    const updatedItem = {
        id,
        storeName,
        goods,
        unitPrice,
        quantity,
        totalPrice,
        isAvailable
    };

    db[index] = updatedItem;
    writeDB(db);

    res.json(updatedItem);
});

// DELETE
app.delete('/groceries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const db = readDB();
    const newDB = db.filter(i => i.id !== id);

    if (newDB.length === db.length)
        return res.status(404).json({ message: 'Item not found' });

    writeDB(newDB);
    res.json({ message: 'Item deleted successfully' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
