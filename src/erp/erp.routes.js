const express = require("express");
const router = express.Router();
const erp = require("./erp.service");

// GET /erp/customers/:id
router.get("/customers/:id", async (req, res, next) => {
  try {
    const customer = await erp.getCustomerById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

// GET /erp/customers/:id/invoices
router.get("/customers/:id/invoices", async (req, res, next) => {
  try {
    const invoices = await erp.getInvoicesByCustomerId(req.params.id);
    res.json(invoices);
  } catch (err) {
    next(err);
  }
});

// PUT /erp/customers/:id/status
router.put("/customers/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    const updated = await erp.updateInvoiceStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice status updated successfully" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
