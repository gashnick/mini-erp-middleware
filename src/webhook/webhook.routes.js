const express = require("express");
const router = express.Router();
const { handleMessage } = require("./webhook.controller");

// POST /webhook/message
router.post("/message", handleMessage);

module.exports = router;
