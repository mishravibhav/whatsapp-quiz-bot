const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const indexRoutes = require('./routes/index.route');
const errorMiddleware = require('./middlewares/app.middleware').errorResponder;
const startBot = require('./bot');
const config = require('../src/config/global.config')

const app = express();
const server = http.createServer(app);
const io = new Server(server, config.whitelisted_domains_and_methods);

app.use(express.json());
app.use(cors({ origin: config.whitelisted_domains_and_methods }));
app.use('/v1/api/', indexRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(PORT, () =>
    console.log(`🚀 Server running with Socket.IO on port ${PORT}`)
  );

  startBot(io); // 👈 pass Socket.IO instance to bot
});
