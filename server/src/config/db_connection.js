const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/IU_Hackathon', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    });
        console.log('Database connected');
    }
    catch(err) {
        console.log('Connect database failed')
    }
} 

module.exports = {connect};