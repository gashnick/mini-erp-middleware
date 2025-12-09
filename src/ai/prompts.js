function buildCustomerAnalysisPrompt(customer, invoices) {
  // keep the prompt short and ask for JSON only
  return `
You are an expert financial/account manager. Given the customer and invoice data below,
produce **valid JSON only** with these keys:
- riskLevel (Low|Medium|High)
- behaviourPattern (short sentence)
- recommendedAction (short sentence)
- invoiceSummary (object with totalInvoices, unpaidCount, totalOutstanding, avgInvoiceAmount)

Customer:
${JSON.stringify(customer)}

Invoices:
${JSON.stringify(invoices)}

Return only JSON.
`;
}

module.exports = { buildCustomerAnalysisPrompt };
