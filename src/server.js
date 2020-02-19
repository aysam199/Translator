const http = require('http');
const router = require('./router.js');

const server = http.createServer(router);

server.listen(process.env.PORT || 1324);

console.log("server is running on port 1324")