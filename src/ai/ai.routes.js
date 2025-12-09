const express = require("express");
const router = express.Router();
const erp = require("../erp/erp.service");
const ai = require("./ai.service");

// POST /ai/analyze-customer
router.post("/analyze-customer", async (req, res, next) => {
  try {
    const { customerId, provider } = req.body;
    if (!customerId)
      return res.status(400).json({ error: "customerId is required" });

    const customer = await erp.getCustomerById(customerId);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const invoices = await erp.getInvoicesByCustomerId(customerId);
    const analysis = await ai.analyzeCustomerData(customer, invoices, provider);
    res.json({ customer, invoices, analysis });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
