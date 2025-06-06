const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const connectDB = require('./database/db.connection');
const indexRoutes = require('./routes/index.route');
const errorMiddleware = require('./middlewares/app.middleware').errorResponder;
const startBot = require('./bot');
const config = require('../src/config/global.config');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  ...config.whitelisted_domains
});

app.use(helmet());

app.use(cors(
  config.whitelisted_domains
));

app.use(express.json({ limit: '10kb' }));


const apiLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use('/v1/api/', apiLimiter);

app.use('/v1/api/', indexRoutes);
app.use(errorMiddleware);

const socketRateLimitMap = new Map();

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.onAny((event, ...args) => {
    const now = Date.now();
    const timestamps = socketRateLimitMap.get(socket.id) || [];

    const recentTimestamps = timestamps.filter(ts => now - ts < 10000);
    recentTimestamps.push(now);

    socketRateLimitMap.set(socket.id, recentTimestamps);

    if (recentTimestamps.length > 20) {
      socket.emit('rate-limit', { message: 'You are sending events too fast, slow down!' });
      return;
    }

  });

  socket.on('disconnect', () => {
    socketRateLimitMap.delete(socket.id);
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server and DB connection
const PORT = config.port

connectDB().then(() => {
  server.listen(PORT, () =>
    console.log(`🚀 Server running with Socket.IO on port ${PORT}`)
  );

  startBot(io);
});
