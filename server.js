const express = require('express');
const handler404 = require('./middleware/404handler');
const handler500 = require('./middleware/500handler');
const app = express();
const PORT = process.env.PORT || 3500;

app.get('/', (req, res) => {
    res.send('Backend PAW Project 2024');
});
app.all('*', handler404);
app.use(handler500);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);   
});


