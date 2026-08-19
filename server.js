const express = require('express');

const app = express();

const PORT = 3000;
const WAREHOUSE_API = 'http://localhost:4000/warehouse/inventory';

// In-memory inventory cache
const stockCache = {};

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('NorthStar Inventory Polling Service is running');
});

// Poll the warehouse API
async function syncInventory() {
  try {
    console.log('🔄 Polling warehouse inventory...');

    const response = await fetch(WAREHOUSE_API);

    if (!response.ok) {
      throw new Error(`Warehouse API returned ${response.status}`);
    }

    const data = await response.json();

    // Update cache with warehouse inventory
    data.inventory.forEach(product => {
      stockCache[product.productId] = {
        productId: product.productId,
        productName: product.productName,
        quantity: product.quantity,
        warehouse: product.warehouse,
        lastUpdated: new Date().toISOString()
      };
    });

    console.log('✅ Inventory synchronized');
    console.log(stockCache);

  } catch (error) {
    console.error('❌ Warehouse polling failed:', error.message);
  }
}

// Manual sync endpoint for testing
app.post('/sync', async (req, res) => {
  await syncInventory();

  res.json({
    message: 'Inventory synchronization completed'
  });
});

// Stock query endpoint
app.get('/stock/:productId', (req, res) => {
  const productId = req.params.productId;

  const stock = stockCache[productId];

  if (!stock) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  res.status(200).json(stock);
});

// Stock availability endpoint
app.get('/stock/:productId/status', (req, res) => {
  const productId = req.params.productId;

  const stock = stockCache[productId];

  if (!stock) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  res.status(200).json({
    productId: stock.productId,
    productName: stock.productName,
    inStock: stock.quantity > 0,
    quantity: stock.quantity
  });
});

// Start polling every 5 minutes
const POLL_INTERVAL = 5 * 60 * 1000;

setInterval(syncInventory, POLL_INTERVAL);

app.listen(PORT, () => {
  console.log(
    `NorthStar Inventory Polling Service running on http://localhost:${PORT}`
  );

  // Perform an initial synchronization when the service starts
  syncInventory();
});