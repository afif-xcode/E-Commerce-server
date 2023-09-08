const express = require("express");
const app = express();
require("dotenv").config();
const ConnectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");

const userRoutes = require("./routes/User");
const productRoutes = require("./routes/ProductRoute");

// Connect with Db
ConnectDB();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Settig the routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Hello World").status(200);
});

app.listen(PORT, () => {
  console.log(`Your server is runnig on port ${PORT}`);
});
