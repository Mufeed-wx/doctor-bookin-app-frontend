const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on("connected", () => {
    console.log('DataBase Connected')
})

connection.on('error', (error) => {
    console.log("Error in DB connection",error)
})


module.exports = mongoose;
