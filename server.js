const http = require('http');

const port = 8080;

const requestListener = function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end();
}

const server = http.createServer(requestListener);

server.listen(port, () => {
    console.log(`Server running at port ${port}`)
})