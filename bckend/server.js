require("dotenv").config();
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const protect = require("./middleware/authMiddleware");
const scheduler = require("./utils/scheduler");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for development
    methods: ["GET", "POST"]
  }
});

// Store io on app for access in controllers
app.set("io", io);

// ================= DATABASE & SCHEDULER =================
connectDB();
scheduler.initScheduler();

// ================= WEBSOCKETS HUB =================
io.on("connection", (socket) => {
  console.log(`📡 New Live Connection: ${socket.id}`);
  
  // Real-time Dashboard Subscription
  socket.on("subscribe:stats", () => {
    console.log(`📈 Client ${socket.id} subscribed to Real-Time Stats`);
    socket.join("stats_room");
  });

  socket.on("disconnect", () => {
    console.log(`📉 Offline: ${socket.id}`);
  });
});

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/campaigns", require("./routes/campaignRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/email", require("./routes/email.routes"));
app.use("/api/datasets", require("./routes/datasetRoutes"));

// Production Static Files
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist/frontend/browser");
  app.use(express.static(frontendPath));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => res.send("🚀 Velox Reactive Backend Running"));
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🔥 Velox Reactive Server running on port ${PORT}`);
});