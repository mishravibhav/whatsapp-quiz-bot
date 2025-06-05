const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const indexRoutes = require('./routes/user.routes');
const errorMiddleware = require('./middlewares/app.middleware').errorResponder;
const startBot = require('./bot');
require('dotenv').config();

const app = express();
const server = http.createServer(app); // 👈 wrap express in HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use('/v1/api/', indexRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(PORT, () =>
    console.log(`🚀 Server running with Socket.IO on port ${PORT}`)
  );

  startBot(io); // 👈 pass Socket.IO instance to bot
});
