# ERP Middleware MVP (Express)

Small MVP: fake ERP + AI analysis (OpenAI/Gemini) + social webhook simulation.

## Features

- Mock ERP (JSON file) with customers & invoices
- ERP routes:
  - GET /erp/customers/:id
  - GET /erp/customers/:id/invoices
  - PUT /erp/customers/:id/status
- AI analysis:
  - POST /ai/analyze-customer -> returns risk, behaviour, recommendedAction, invoiceSummary
- Webhook simulation:
  - POST /webhook/message -> detects intent, fetches ERP data, calls AI, returns text reply
- Simple API key auth (`x-api-key` header)

## Quick start

1. Clone repository and `cd` into it.
2. `npm install`
3. Copy `.env.example` -> `.env` and fill your keys.
4. `npm start`
5. Use Postman or curl (see `postman_collection.json`).

### Example curl:

```bash
# health
curl -H "x-api-key: super-secret-test-key" http://localhost:3000/health

# get customer
curl -H "x-api-key: super-secret-test-key" http://localhost:3000/erp/customers/1234

# analyze
curl -X POST -H "Content-Type: application/json" -H "x-api-key: super-secret-test-key" -d '{"customerId":"1234"}' http://localhost:3000/ai/analyze-customer
```
