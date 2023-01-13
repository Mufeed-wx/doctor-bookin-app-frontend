const express = require('express')
const app = express()
require('dotenv').config()
const dbCofig = require('./config/dbConfig')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const doctorRoute = require('./routes/doctorRoute')

app.use(express.json())

app.use('/api/user', userRoute)
app.use('/api/admin', adminRoute)
app.use('/api/doctor', doctorRoute)

const port = process.env.PORT || 5001
app.listen(port, () => console.log('Node server started', port))