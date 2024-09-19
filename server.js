require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const handler404 = require('./middleware/404handler');
const handler500 = require('./middleware/500handler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {logger, logEvents} = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 3500;
const app = express();
connectDB();


app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Backend PAW Project 2024');
});

app.use("/user", require('./routes/userRoutes'));
app.use('/update', require('./routes/patchRoutes'));

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

