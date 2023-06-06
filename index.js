const express = require('express');
const { connection } = require('./config/db');
const {userRouter} = require('./Routes/user.Routes');
const {postRouter} = require('./Routes/post.Routes');


const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());



app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use(userRouter)
app.use(postRouter)


app.listen(3000, async () => {
    try {
        await connection;
        console.log('Database connected');
    } catch (error) {
        console.log('Error connecting to database');
    }
    console.log('Server listening on port 3000');
});