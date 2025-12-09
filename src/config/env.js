module.exports = {
  AI_PROVIDER: process.env.AI_PROVIDER || "gemini",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  API_KEY: process.env.API_KEY || "",
  AI_TIMEOUT_MS: parseInt(process.env.AI_TIMEOUT_MS, 10) || 10000,
};
