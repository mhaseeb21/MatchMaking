// app.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const requirementRoutes = require("./routes/requirementRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const chatRoutes = require("./routes/chatRoutes");

const errorHandler = require("./middleware/errorHandler");
const auth = require("./middleware/auth");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/chat", chatRoutes);

// Test protected route
app.get("/api/protected", auth, (req, res) => {
  res.json({ msg: "You accessed a protected route", user: req.user });
});

// Error handler (last)
app.use(errorHandler);

module.exports = app;
