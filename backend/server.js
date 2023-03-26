const express = require("express");
const connectDB = require("./config/connectDB");
const userRoutes = require("./routes/user");
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));
connectDB();
app.use("/api/users", userRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(port, () => console.log(`Server running on port ${port}`));

