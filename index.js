const express = require("express");
const app = express();
require("dotenv").config();
const ConnectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");

const userRoutes = require("./routes/User");
const productRoutes = require("./routes/Product");
const categoryRoutes = require('./routes/Category');
const addressRoutes = require('./routes/Address');
const orderRoutes = require('./routes/Orders');

// Connect with Db
ConnectDB();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Connecting to cloudinary
cloudinaryConnect();

// Settig the routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("Hello World").status(200);
});

app.listen(PORT, () => {
  console.log(`Your server is runnig on port ${PORT}`);
});
