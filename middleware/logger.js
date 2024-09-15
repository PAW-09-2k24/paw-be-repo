const {format } = require('date-fns');
const {v4: uuid} = require('uuid');
const fs = require('fs');
const fspromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`;
    const logMessage = `${dateTime}\t${uuid()}${message}\n`;

    try{
        if(!fs.existsSync(path.join(__dirname, '../logs'))){
            await fspromises.mkdir(path.join(__dirname, '../logs'));
        }
        await fspromises.appendFile(path.join(__dirname, `../logs/${logFileName}.log`), logMessage);
    } catch (error){
        console.error(error);
    }
};

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog');
    console.log(`${req.method}\t${req.path}`);
    next();
}

module.exports = {logger, logEvents};
