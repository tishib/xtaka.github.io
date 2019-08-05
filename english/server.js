'use strict';
const express = require('express');
const path = require('path');
const opn = require('opn');

const server = express();
const port = 8081;
const scheme = 'http';
const hostname = 'localhost';

server.use(express.static(path.join(__dirname)));

server.listen(port, () => {
  let url = `${scheme}:\/\/${hostname}:${port}`;
  console.log(`Running on ${url}`);
  opn(`${url}`)
});


console.log(process.platform)
