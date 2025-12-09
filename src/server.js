require("dotenv").config();
const app = require("./app");
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`ERP Middleware MVP running on http://localhost:${PORT}`);
});
