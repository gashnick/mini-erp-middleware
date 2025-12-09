const fs = require("fs").promises;
const path = require("path");

const DB_PATH = path.join(__dirname, "erp.mock.db.json");

async function readDB() {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeDB(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

async function getCustomerById(id) {
  const db = await readDB();
  return db.customers.find((customer) => customer.id === id) || null;
}

async function getInvoicesByCustomerId(customerId) {
  const db = await readDB();
  return db.invoices.filter((invoice) => invoice.customerId === customerId);
}

async function updateInvoiceStatus(invoiceId, status) {
  const db = await readDB();
  const idx = db.customers.findIndex((c) => c.id === invoiceId);
  if (idx === -1) return null;
  db.invoices[idx].status = status;
  await writeDB(db);
  return db.invoices[idx];
}

module.exports = {
  getCustomerById,
  getInvoicesByCustomerId,
  updateInvoiceStatus,
};
