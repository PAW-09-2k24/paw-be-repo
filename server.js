require('dotenv').config();
const express = require('express');
const handler404 = require('./middleware/404handler');
const handler500 = require('./middleware/500handler');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const {logger} = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3500;

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Backend PAW Project 2024');
});
app.all('*', handler404);
app.use(handler500);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);   
});

app.use(errorHandler);

