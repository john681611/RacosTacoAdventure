const http = require('http');
const fs = require('fs');
const express = require('express');
let app = express();
var path    = require("path");
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.listen(3000, console.log("Node API Server Running!!!"));