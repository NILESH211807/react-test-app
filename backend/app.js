const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

const connectDb = require("./config/db.config");
const errorHandler = require("./middlewares/errorHandler");
const redisConfig = require("./config/redisConfig");

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");

const PORT = process.env.PORT || 5500;

// middlewares
app.use(
  cors({
    origin: [process.env.FRONTEND_BASE_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads")); // Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello from docker done" });
});

// error handler
app.use(errorHandler);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
});
