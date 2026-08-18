const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

const WEBHOOK_SECRET = 'northstar-demo-secret';

// This lets us read JSON that gets sent to us
app.use(express.json());

// This is the webhook endpoint - with HMAC verification
app.post('/webhook', (req, res) => {
  const receivedSignature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  if (receivedSignature !== expectedSignature) {
    console.log('❌ Invalid signature');
    return res.status(401).send('Unauthorized');
  }
const { orderId, status, customer } = req.body;

if (!orderId || !status || !customer) {
  console.log('❌ Missing required fields');
  return res.status(400).send('Bad Request: Missing required fields');
}

console.log('✅ Webhook received!');
console.log('Data:', req.body);
res.status(200).send('OK');
 
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
