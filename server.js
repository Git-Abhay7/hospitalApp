require('dotenv').config();
require("./db/dbConfig")
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const patientRoute = require("./router/patientRoute")
const hospitalRoute = require("./router/hospitalRoute")

app.get('/', (req, res) => {
    res.send({ Server: 'Welcome To Hospital Management App' });
})
    // .use(cors())
    .use(express.json())
    .use(express.urlencoded({ limit: '10mb', extended: true }))
    .use('/api/v1/', hospitalRoute)
    .use('/api/v1/', patientRoute)


server.listen(process.env.PORT, () => console.log('App server is running on', process.env.PORT));