const express = require('express');
const {router} = require('./routes/approutes'); 
const app = express();
app.use('/', router);

const port = 3000;
app.listen(port, ()=> { console.log("server is started now." )});