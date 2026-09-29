const dns = require("dns");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

// Use public DNS for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB();

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================
// ROUTES
// =====================================

const authRoutes =
  require("./routes/authRoutes");

const dashboardRoutes =
  require("./routes/dashboardRoutes");

const eventRoutes =
  require("./routes/eventRoutes");

const userRoutes =
  require("./routes/userRoutes");

const alumniManagementRoutes =
  require("./routes/alumniManagementRoutes");

const jobRoutes =
  require("./routes/jobRoutes");

const notificationRoutes =
  require("./routes/notificationRoutes");

const connectionRoutes =
  require("./routes/connectionRoutes");

const mentorshipRoutes =
  require("./routes/mentorshipRoutes");

// =====================================
// API ROUTES
// =====================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/events",
  eventRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/staff/alumni-management",
  alumniManagementRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/connections",
  connectionRoutes
);

app.use(
  "/api/mentorship",
  mentorshipRoutes
);

// =====================================
// UPLOADS
// =====================================

app.use(
  "/uploads",
  express.static("uploads")
);

// =====================================
// ROOT
// =====================================

app.get("/", (req, res) => {
  res.json({
    message:
      "Alumni Nexus Backend is Running",
  });
});

// =====================================
// SERVER
// =====================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});