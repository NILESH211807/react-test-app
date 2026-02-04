const express = require("express");

const app = express();

const PORT = process.env.PORT || 5500;

app.get("/", (req, res) => {
  res.send("Hello from docker");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
