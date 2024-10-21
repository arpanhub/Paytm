const express = require('express');
const cors = require('cors');
const mainRouter = require('./router/index');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/v1',mainRouter);

app.listen(3000,()=>{
    console.log('Server is running on http://localhost:3000');
});