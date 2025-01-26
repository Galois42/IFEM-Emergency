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

const IFEM_API = "https://ifem-award-mchacks-2025.onrender.com/api/v1/queue";

// Store active users
const activeUsers = new Map();

// Get patient data from IFEM API
app.get("/api/patient/:id", async (req, res) => {
  console.log("server");
  try {
    const response = await axios.get(IFEM_API);
    const queueData = response.data;
    
    // Find the specific patient in the queue
    // const patient = queueData.patients.find(p => p.id === req.params.id);
    console.log(queueData);
    const patient = queueData.patients[Math.floor(Math.random() * 24) + 1];
    
    if (patient) {
      // Format the patient data
      const formattedData = {
        id: patient.id,
        triage_category: patient.triage_category,
        time_elapsed: patient.time_elapsed,
        status: {
          current_phase: patient.status.current_phase,
          investigations: patient.status.investigations || {}
        },
        queue_position: patient.queue_position,
        arrival_time: patient.arrival_time
      };
      
      res.json(formattedData);
    } else {
      res.status(404).json({ error: "Patient not found in queue" });
    }
  } catch (error) {
    console.error('Error fetching queue data:', error);
    res.status(500).json({ error: "Error fetching patient data" });
  }
});

app.get("/api/queue/stats", async (req, res) => {
  try {
    const response = await axios.get(IFEM_API);
    const queueData = response.data;
    
    const stats = {
      totalWaiting: queueData.waitingCount,
      longestWait: queueData.longestWaitTime,
      byCategory: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      }
    };
    
    // Count patients by triage category
    queueData.patients.forEach(patient => {
      stats.byCategory[patient.triage_category]++;
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching queue statistics" });
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  let registeredPatientId = null;

  socket.on("register", (patientData) => {
    activeUsers.set(socket.id, {
      id: patientData.id,
      triageCategory: patientData.triage_category,
      timeElapsed: patientData.time_elapsed,
    });
    console.log("resgister");
    registeredPatientId = patientData.id;
    console.log(`Patient ${registeredPatientId} registered`);
  });

  // Set up periodic updates for registered patient
  const updateInterval = setInterval(async () => {
    if (registeredPatientId) {
      try {
        const response = await axios.get(IFEM_API);
        const queueData = response.data;
        const patient = queueData.patients.find(p => p.id === registeredPatientId);
        
        if (patient) {
          const updatedData = {
            id: patient.id,
            triage_category: patient.triage_category,
            time_elapsed: patient.time_elapsed,
            status: {
              current_phase: patient.status.current_phase,
              investigations: patient.status.investigations || {}
            },
            queue_position: patient.queue_position
          };
          
          socket.emit("patient_update", updatedData);
        }
      } catch (error) {
        console.error('Error updating patient data:', error);
      }
    }
  }, 5000); // Update every 5 seconds

  socket.on("disconnect", () => {
    console.log(`Patient ${registeredPatientId} disconnected`);
    clearInterval(updateInterval);
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  let registeredPatientId = null;

  socket.on("register", (patientData) => {
    registeredPatientId = patientData.id;
    console.log(`Patient ${registeredPatientId} registered`);
  });

  // Set up periodic updates for registered patient
  const updateInterval = setInterval(async () => {
    if (registeredPatientId) {
      try {
        const response = await axios.get(IFEM_API);
        const queueData = response.data;
        const patient = queueData.patients.find(p => p.id === registeredPatientId);
        
        if (patient) {
          const updatedData = {
            id: patient.id,
            triage_category: patient.triage_category,
            time_elapsed: patient.time_elapsed,
            status: {
              current_phase: patient.status.current_phase,
              investigations: patient.status.investigations || {}
            },
            queue_position: patient.queue_position
          };
          
          socket.emit("patient_update", updatedData);
        }
      } catch (error) {
        console.error('Error updating patient data:', error);
      }
    }
  }, 5000); // Update every 5 seconds

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

  socket.on("send_message", (data) => {
    console.log(activeUsers);
    const userData = activeUsers.get(socket.id);
    if (!userData) return;

    // Simple matching logic based on triage category and wait time
    const matches = [...activeUsers.entries()].filter(([id, user]) => {
      return (
        id == data.matchId
      );
    });

    if (matches.length > 0) {
      const match = matches[0];
      // Emit match found event to both users
      io.to(match[0]).emit("message_received", { message: data.message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Patient ${registeredPatientId} disconnected`);
    clearInterval(updateInterval);
    activeUsers.delete(socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
