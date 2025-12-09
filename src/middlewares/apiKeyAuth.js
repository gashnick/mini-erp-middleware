const { API_KEY } = require("../config/env");

module.exports = (req, res, next) => {
  const key = req.header("x-api-key");
  if (!API_KEY) {
    console.warn(
      "No API_KEY configured in environment variables; allowing all routes requests(development mode)."
    );
    return next();
  }

  if (!key || key !== API_KEY) {
    return res
      .status(401)
      .json({ error: "Unauthorized: invalid or missing x-api-key header" });
  }
  next();
};
