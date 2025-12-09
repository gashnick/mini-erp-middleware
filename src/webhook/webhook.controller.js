const erp = require("../erp/erp.service");
const ai = require("../ai/ai.service");
const { detectIntent } = require("../utils/intent");

function formatReply(analysis, customer) {
  const summary = analysis.invoiceSummary || {};
  return `
Customer: ${customer.name} (ID ${customer.id})
Risk: ${analysis.riskLevel}
Behavior: ${analysis.behaviourPattern}
Action: ${analysis.recommendedAction}
Invoices: total ${summary.totalInvoices || "N/A"}, unpaid ${
    summary.unpaidCount || "N/A"
  }, outstanding ${summary.totalOutstanding || "N/A"}
`.trim();
}

async function handleMessage(req, res, next) {
  try {
    const { platform, message } = req.body;
    if (!platform || !message)
      return res.status(400).json({ error: "platform and message required" });

    const intent = detectIntent(message);
    if (intent.intent === "analyze_customer") {
      const customer = await erp.getCustomerById(intent.customerId);
      if (!customer)
        return res.status(404).json({ error: "Customer not found" });
      const invoices = await erp.getInvoicesByCustomerId(intent.customerId);
      const analysis = await ai.analyzeCustomerData(customer, invoices);

      const replyText = formatReply(analysis, customer);
      // In real integration we'd post back to the platform webhook, here we just return JSON
      return res.json({ platform, reply: replyText, analysis });
    }

    return res.json({
      platform,
      reply: "I didn't understand. Try: 'Show me customer 1234 performance'.",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleMessage };
