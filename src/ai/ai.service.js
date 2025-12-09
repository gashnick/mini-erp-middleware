const axios = require("axios");

const { buildCustomerAnalysisPrompt } = require("./prompts");
const {
  OPENAI_API_KEY,
  GEMINI_API_KEY,
  AI_PROVIDER,
  AI_TIMEOUT_MS,
} = require("../config/env");

const e = require("express");

async function callOpenAI(prompt) {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

  const url = "https://api.openai.com/v1/responses";

  const data = {
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: "You are a JSON-only assistant." },
      { role: "user", content: prompt },
    ],
    max_output_tokens: 800,
    temperature: 0,
  };

  const resp = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  return resp.data.output_text;
}

/**
 * Calls the Gemini API to generate content.
 * Note: This version assumes you are running in a Node.js environment
 * that supports the global 'fetch' function, or you have polyfilled it.
 */
async function callGemini(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  // 1. Updated Model: Using the general-purpose Flash model (gemini-2.5-flash)
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    GEMINI_API_KEY;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        // 2. Fix: Use 'generationConfig' instead of 'config' for parameters like temperature
        generationConfig: {
          temperature: 0, // Set to 0 for structured, deterministic JSON output
        },
      }),
      timeout: AI_TIMEOUT_MS,
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        data.error?.message || "Gemini API returned an unknown error.";
      console.error("Gemini API Error:", errorMessage);
      throw new Error(errorMessage);
    }

    // Extract text correctly from the structured response
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated";

    return text;
  } catch (err) {
    // Log the detailed error before falling back
    console.error("Gemini API Request Failed:", err.message);

    // Fallback: use OpenAI
    if (OPENAI_API_KEY) {
      console.warn("Falling back to OpenAI...");
      return callOpenAI(prompt);
    }

    // If no fallback, throw the original error
    throw err;
  }
}
function parseJsonSafe(text) {
  // Try to extract json from text robustly
  text = text.trim();
  // if text contains leading/trailing backticks remove them
  text = text
    .replace(/^```json\s*/, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(text);
  } catch (e) {
    // try to find first { and last } and parse that substring
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      const sub = text.substring(firstBrace, lastBrace + 1);
      return JSON.parse(sub);
    }
  }
  throw new Error("Failed to parse JSON from AI response");
}

async function analyzeCustomerData(customer, invoices, provider = AI_PROVIDER) {
  const prompt = buildCustomerAnalysisPrompt(customer, invoices);
  let raw;
  if ((provider || "").toLowerCase() === "gemini") {
    raw = await callGemini(prompt);
  } else {
    raw = await callOpenAI(prompt);
  }
  const json = parseJsonSafe(raw);
  // As a safety, normalize fileds
  return {
    riskLevel: json.riskLevel || "Unknown",
    behaviourPattern: json.behaviourPattern || "",
    recommendedAction: json.recommendedAction || "",
    invoiceSummary: json.invoiceSummary || {
      totalInvoices: 0,
      unpaidCount: 0,
    },
  };
}

module.exports = { analyzeCustomerData };
