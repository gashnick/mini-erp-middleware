function detectIntent(message) {
  if (!message || typeof message !== "string") return { intent: "unknown" };
  const lower = message.toLowerCase();
  const customerMatch = lower.match(/customer\s+(\d+)/);
  if (customerMatch) {
    return { intent: "analyze_customer", customerId: customerMatch[1] };
  }
  if (/status\s+of\s+customer\s+(\d+)/.test(lower)) {
    const m = lower.match(/status\s+of\s+customer\s+(\d+)/);
    return { intent: "get_status", customerId: m[1] };
  }
  if (/flag\s+customer\s+(\d+)/.test(lower)) {
    const m = lower.match(/flag\s+customer\s+(\d+)/);
    return { intent: "flag_customer", customerId: m[1] };
  }
  return { intent: "unknown" };
}

module.exports = { detectIntent };
