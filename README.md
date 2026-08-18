# NorthStar Inventory Sync

A Node.js and Express webhook-based inventory synchronization service developed for the **Meridian Pivot** practical assignment.

## Project Overview

NorthStar Retail Co. needs its customer support tool to provide accurate answers to inventory questions such as:

> **"Is this product in stock?"**

This prototype receives inventory updates through a webhook, verifies the authenticity of the request, validates the inventory data, stores the latest stock state, and provides endpoints that allow a support tool to query inventory availability.

## Current Architecture

```text
Warehouse
    |
    | Inventory update
    v
POST /webhook
    |
    +--> HMAC signature verification
    |
    +--> Required-field validation
    |
    +--> Quantity validation
    |
    v
In-Memory Stock Cache
    |
    +--> GET /stock/:productId
    |
    +--> GET /stock/:productId/status
    |
    v
Support Tool
"Is it in stock?"
```

## Technology Stack

* Node.js
* Express.js
* JavaScript
* HMAC-SHA256
* Git
* GitHub

## Features

### Webhook Inventory Synchronization

The service accepts inventory updates through:

```text
POST /webhook
```

Inventory data includes:

* Product ID
* Product name
* Quantity
* Warehouse

### Webhook Security

Incoming webhook requests are verified using an HMAC-SHA256 signature.

Invalid signatures are rejected with:

```text
401 Unauthorized
```

### Inventory Validation

The service validates:

* Required inventory fields
* Quantity data type
* Non-negative inventory quantities

Invalid inventory data is rejected before it can overwrite valid cached inventory.

### Inventory Query

The current inventory for a product can be retrieved using:

```text
GET /stock/:productId
```

### Stock Availability

The support tool can directly check whether a product is in stock using:

```text
GET /stock/:productId/status
```

The response includes:

* Product ID
* Product name
* Quantity
* `inStock` status

## Example

For a synchronized product:

```json
{
  "productId": "SKU-1001",
  "productName": "Blue T-Shirt",
  "quantity": 10,
  "warehouse": "Pretoria"
}
```

The availability endpoint returns:

```json
{
  "productId": "SKU-1001",
  "productName": "Blue T-Shirt",
  "inStock": true,
  "quantity": 10
}
```

When the quantity is zero:

```json
{
  "productId": "SKU-1001",
  "productName": "Blue T-Shirt",
  "inStock": false,
  "quantity": 0
}
```

## Testing

The prototype has been tested for:

| Test        | Scenario                     | Result |
| ----------- | ---------------------------- | ------ |
| NS-SYNC-001 | Receive inventory update     | PASS   |
| NS-SYNC-002 | Query synchronized inventory | PASS   |
| NS-SYNC-003 | Update existing inventory    | PASS   |
| NS-SYNC-004 | Invalid HMAC signature       | PASS   |
| NS-SYNC-005 | Missing required field       | PASS   |
| NS-SYNC-006 | Negative quantity            | PASS   |
| NS-SYNC-007 | Unknown product              | PASS   |
| NS-SYNC-008 | In-stock status              | PASS   |
| NS-SYNC-009 | Out-of-stock status          | PASS   |

## Current Limitation

The prototype currently uses an **in-memory stock cache**.

This means synchronized inventory is lost when the Node.js server restarts.

For a production implementation, persistent storage such as a database would be required.

## Learning & Troubleshooting

This project forms part of the Meridian Pivot practical assignment, which focuses on independent learning, troubleshooting, documentation, and adaptability.

During development, documented blockers included:

* Webhook validation and server restart issues
* Git installation and command-line setup
* Local and remote Git history conflicts
* `.gitignore` merge conflict resolution
* GitHub authentication
* In-memory cache reset after restarting the server

These issues were investigated and resolved independently.

## GitHub Development History

The project is maintained using Git and GitHub so that development progress, feature changes, and troubleshooting milestones can be tracked through commits.

## Project Status

**Current status:** Working webhook-based inventory synchronization MVP.

### Completed

* Webhook receiving
* HMAC verification
* Inventory validation
* Inventory synchronization
* Inventory querying
* Stock availability status
* Positive and negative inventory testing
* GitHub version control

### Next Steps

* Continue testing
* Document the original specification and sprint changes
* Prepare for the Meridian Pivot from polling to webhook-based synchronization
* Document scope changes and architectural trade-offs
* Complete final sprint readiness checks
