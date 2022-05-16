const mongoose = require('mongoose');

require('./Car');
require('./Accessory');

const dataUrl = 'mongodb://localhost:27017/carbicle'

async function init(){
    try{
        await mongoose.connect(dataUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('database connected');

        mongoose.connection.on('error', (err) => {
            console.error('Database error');
            console.error(err);
        })
    } catch (e) {
        console.log('Error connecting to the database');
        process.exit(1);
    }
}

module.exports = init;