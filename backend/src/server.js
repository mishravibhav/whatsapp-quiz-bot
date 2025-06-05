const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const indexRoutes = require('./routes/index.route');
const errorMiddleware = require('./middlewares/app.middleware').errorResponder;
const startBot = require('./bot');
const config = require('../src/config/global.config');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  ...config.whitelisted_domains
});

// 1. Basic security headers
app.use(helmet());

// 2. CORS (already configured, but explicitly setting options here)
app.use(cors(
  config.whitelisted_domains
));

// 3. Body size limit to prevent large payload attacks
app.use(express.json({ limit: '10kb' }));

// 4. Rate Limiter for HTTP requests
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use('/v1/api/', apiLimiter); // Apply to API routes

// 5. Routes and error middleware
app.use('/v1/api/', indexRoutes);
app.use(errorMiddleware);

// 6. Socket.IO event rate limiting (basic example)
const socketRateLimitMap = new Map();

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Simple rate limiting per socket id for events
  socket.onAny((event, ...args) => {
    const now = Date.now();
    const timestamps = socketRateLimitMap.get(socket.id) || [];

    // Remove timestamps older than 10 seconds
    const recentTimestamps = timestamps.filter(ts => now - ts < 10000);
    recentTimestamps.push(now);

    socketRateLimitMap.set(socket.id, recentTimestamps);

    if (recentTimestamps.length > 20) {
      // Too many events in last 10 seconds
      socket.emit('rate-limit', { message: 'You are sending events too fast, slow down!' });
      // Optionally disconnect socket or ignore event
      return;
    }

    // Handle the event normally or forward it to your bot logic
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
