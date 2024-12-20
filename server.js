require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const handler404 = require('./middleware/404handler');
const handler500 = require('./middleware/500handler');
const sessionMiddleware = require('./middleware/expressSession');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/db');
const passport = require('./config/google-strategy');
const PORT = process.env.PORT || 3500;
const app = express();
connectDB();

switch (process.env.NODE_ENV) {
  case "development":
    const { logger, logEvents } = require('./middleware/logger');
    app.use(logger);
    break;
    case "production":
      break;
      default:
        break;
      }
      
      app.use(cors(corsOptions));
      app.use(express.json());
      app.use(cookieParser());
      
      app.get('/', (req, res) => {
        res.send('Backend PAW Project 2024');
      });
// Use the new task routes
sessionMiddleware(app);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", require('./routes/googleRoutes'));
app.use('/task', require('./routes/taskRoutes'));
app.use("/user", require('./routes/userRoutes'));
app.use("/group", require('./routes/groupRoutes'));
app.all('*', handler404);
app.use(handler500);

// app.listen(PORT, () => {
  //     console.log(`Server is running on port ${PORT}`);   
  // });
  
  let server;
  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    server = app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  });
  
  mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      'mongoErrLog.log');
  });
  
  app.use(errorHandler);
  
  