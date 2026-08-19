const express = require('express');

const app = express();
const PORT = 4000;

// Mock warehouse inventory
let warehouseInventory = [
  {
    productId: 'SKU-1001',
    productName: 'Blue T-Shirt',
    quantity: 10,
    warehouse: 'Pretoria'
  },
  {
    productId: 'SKU-1002',
    productName: 'Black Jeans',
    quantity: 5,
    warehouse: 'Johannesburg'
  }
];

// Warehouse inventory endpoint
app.get('/warehouse/inventory', (req, res) => {
  console.log('Warehouse inventory requested');

  res.json({
    inventory: warehouseInventory,
    retrievedAt: new Date().toISOString()
  });
});

// Simple endpoint to change stock for testing
app.post('/warehouse/inventory/:productId/:quantity', (req, res) => {
  const product = warehouseInventory.find(
    item => item.productId === req.params.productId
  );

  if (!product) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  const quantity = Number(req.params.quantity);

  if (!Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({
      message: 'Invalid quantity'
    });
  }

  product.quantity = quantity;

  console.log(
    `Warehouse updated: ${product.productId} = ${product.quantity}`
  );

  res.json({
    message: 'Warehouse inventory updated',
    product
  });
});

app.listen(PORT, () => {
  console.log(
    `Mock Warehouse API running on http://localhost:${PORT}`
  );
});