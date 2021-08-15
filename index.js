import http from "http";
import fs from "fs";
import url from "url";

http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let filename = "." + q.pathname;
    fs.readFile(filename, (error, data) => {
        if (error) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(3000);


