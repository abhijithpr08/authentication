const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const signupEvent = new EventEmitter();

signupEvent.on("userSignup", (user) => {
    console.log("\nSIGNUP EVENT TRIGGERED");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Password:", user.password);

    let users = [];

    if (fs.existsSync("users.json")) {
        const data = fs.readFileSync("users.json", "utf-8");
        if (data) {
            users = JSON.parse(data);
        }
    }
    users.push(user);
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
});

const viewsDir = path.join(__dirname, "views");
const publicDir = path.join(__dirname, "public");

function serveView(file, res) {
    fs.readFile(path.join(viewsDir, file), (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end("Page not found");
        }
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
        if (err) {
            res.writeHead(404);
            return res.end("File not found");
        }
        res.writeHead(200, { "Content-Type": type });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {

    console.log(req.method, req.url);

    if (req.url.startsWith("/public/")) {
        const file = req.url.replace("/public/", "");
        return servePublic(file, res);
    }

    if (req.method === "GET") {
        if (req.url === "/") return serveView("home.html", res);
        if (req.url === "/login") return serveView("login.html", res);
        if (req.url === "/signup") return serveView("signup.html", res);

        if (req.url === "/display") return serveView("display.html", res);
        if (req.url === "/users") {

            let users = [];

            if (fs.existsSync("users.json")) {
                users = JSON.parse(
                    fs.readFileSync("users.json", "utf-8") || "[]"
                );
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(users));
        }
    }

    if (req.method === "POST" && req.url === "/signup") {

        let chunks = [];

        req.on("data", (chunk) => {
            // console.log("\nCHUNK RECEIVED:");
            // console.log(chunk); 
            // console.log(chunk.toString());

            chunks.push(chunk);
        });

        req.on("end", () => {

            // console.log("\nALL CHUNKS RECEIVED");

            const body = Buffer.concat(chunks).toString();

            // console.log("FULL BODY:");
            // console.log(body);

            const data = JSON.parse(body);

            const password = data.password;
            const confirm = data.confirm;

            const user = {
                name: data.name,
                email: data.email,
                password: password
            };

            signupEvent.emit("userSignup", user);

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Signup successful");
        });
    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
