const express = require("express");
const morgan = require("morgan");
const apiKeyAuth = require("./middlewares/apiKeyAuth");
const erpRoutes = require("./erp/erp.routes");
const aiRoutes = require("./ai/ai.routes");
const webhookRoutes = require("./webhook/webhook.routes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Public route for health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// API key protection for all routes (MVP)
app.use(apiKeyAuth);

// routes
app.use("/erp", erpRoutes);
app.use("/ai", aiRoutes);
app.use("/webhooks", webhookRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

module.exports = app;
