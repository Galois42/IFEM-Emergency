// backend/server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const IFEM_API = "https://ifem-award-mchacks-2025.onrender.com/api/v1";

// Store active users
const activeUsers = new Map();

// Get patient data from IFEM API
app.get("/api/patient/:id", async (req, res) => {
  try {
    const response = await axios.get(`${IFEM_API}/patient/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching patient data" });
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  socket.on("register", (patientData) => {
    activeUsers.set(socket.id, {
      id: patientData.id,
      triageCategory: patientData.triage_category,
      timeElapsed: patientData.time_elapsed,
    });
  });

  socket.on("find_match", (activity) => {
    console.log(activeUsers);
    const userData = activeUsers.get(socket.id);
    if (!userData) return;

    // Simple matching logic based on triage category and wait time
    const matches = [...activeUsers.entries()].filter(([id, user]) => {
      return (
        id !== socket.id &&
        Math.abs(user.triageCategory - userData.triageCategory) <= 1 &&
        Math.abs(user.timeElapsed - userData.timeElapsed) <= 200
      );
    });

    if (matches.length > 0) {
      const match = matches[0];
      // Emit match found event to both users
      socket.emit("match_found", { matchId: match[0], activity });
      io.to(match[0]).emit("match_found", { matchId: socket.id, activity });
    }
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
