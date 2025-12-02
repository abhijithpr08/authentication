const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const signupEvent = new EventEmitter();

signupEvent.on("userSignup", (user) => {
    console.log("\nSIGNUP EVENT");
    console.log("Name :", user.name);
    console.log("Email:", user.email);
    console.log("Password:", user.password);
});

const viewsDir = path.join(__dirname, "views");
const publicDir = path.join(__dirname, "public");

function serveView(file, res) {
    fs.readFile(path.join(viewsDir, file), (err, data) => {
        if (err) return res.end("Page missing");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

function servePublic(file, res) {

    const ext = path.extname(file);

    let type = "text/plain";

    if (ext === ".css") type = "text/css";
    if (ext === ".js") type = "text/javascript";

    fs.readFile(path.join(publicDir, file), (err, data) => {
        if (err) return res.end("File missing");
        res.writeHead(200, { "Content-Type": type });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {

    console.log(req.method, req.url);

    if (req.url.startsWith("/public/")) {
        return servePublic(req.url.replace("/public/", ""), res);
    }

    if (req.method === "GET") {
        if (req.url === "/") return serveView("home.html", res);
        if (req.url === "/login") return serveView("login.html", res);
        if (req.url === "/signup") return serveView("signup.html", res);
    }

    if (req.method === "POST" && req.url === "/signup") {

        let buffers = [];

        req.on("data", chunk => buffers.push(chunk));

        req.on("end", () => {

            const raw = Buffer.concat(buffers).toString();

            const data = JSON.parse(raw);

            const { name, email, password, confirm } = data;

            if (password !== confirm) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end("Passwords do not match");
            }

            const user = {
                name,
                email,
                password
            };

            signupEvent.emit("userSignup", user);

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Signup successful");

        });
    }

});

server.listen(3000, () => {
    console.log("\nServer running at http://localhost:3000");
});
