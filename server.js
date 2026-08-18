const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

const WEBHOOK_SECRET = 'northstar-demo-secret';

// In-memory stock cache
const stockCache = {};

// Lets Express read JSON requests
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('NorthStar Inventory Sync Service is running');
});

// Inventory webhook
app.post('/webhook', (req, res) => {
  const receivedSignature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  // 1. Verify webhook signature
  if (receivedSignature !== expectedSignature) {
    console.log('❌ Invalid signature');
    return res.status(401).send('Unauthorized');
  }

  // 2. Read inventory data
  const { productId, productName, quantity, warehouse } = req.body;

  // 3. Validate required fields
  if (
    !productId ||
    !productName ||
    quantity === undefined ||
    !warehouse
  ) {
    console.log('❌ Missing required inventory fields');
    return res.status(400).send('Bad Request: Missing required inventory fields');
  }

  // 4. Validate quantity
  if (typeof quantity !== 'number' || quantity < 0) {
    console.log('❌ Invalid quantity');
    return res.status(400).send('Bad Request: Invalid quantity');
  }

  // 5. Update the stock cache
  stockCache[productId] = {
    productId,
    productName,
    quantity,
    warehouse,
    lastUpdated: new Date().toISOString()
  };

  console.log('✅ Inventory synchronized!');
  console.log('Stock:', stockCache[productId]);

  res.status(200).json({
    message: 'Inventory synchronized successfully',
    stock: stockCache[productId]
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

app.listen(PORT, () => {
  console.log(`NorthStar Inventory Sync Service running on http://localhost:${PORT}`);
});