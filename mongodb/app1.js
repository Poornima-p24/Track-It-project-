const http = require("http");
const { MongoClient } = require("mongodb");
const querystring = require("querystring");

// MongoDB connection
const url = "mongodb://127.0.0.1:27017";
const dbName = "mydb";

// HTML register form
const formHTML = `
<!DOCTYPE html>
<html>
<head>
 <title>Register Form</title>
</head>
<body>
 <h2>Register</h2>
 <form method="POST" action="/register">
 <label>Name:</label><br>
<input type="text" name="name" required><br><br>
 <label>Email:</label><br>
 <input type="email" name="email" required><br><br>
 <label>Password:</label><br>
 <input type="password" name="password" required><br><br>
 <button type="submit">Register</button>
</form>
</body>
</html>
`;

async function main() {
 const client = new MongoClient(url);
 await client.connect();
 console.log("✅ Connected to MongoDB");

 const db = client.db(dbName);
 const users = db.collection("users");

 // Create HTTP server
 const server = http.createServer((req, res) => {
 if (req.method === "GET" && req.url === "/") {
 // Show register form
 res.writeHead(200, { "Content-Type": "text/html" });
 res.end(formHTML);
 } 
 else if (req.method === "POST" && req.url === "/register") {
let body = "";
 req.on("data", chunk => body += chunk);
 req.on("end", async () => {
 const formData = querystring.parse(body);

// Insert into MongoDB
 await users.insertOne(formData);

 res.writeHead(200, { "Content-Type": "text/html" });
 res.end("<h2> Registration successful!</h2><a href='/'>Go back</a>");
 });
 } 
 else {
 res.writeHead(404, { "Content-Type": "text/plain" });
 res.end("Not Found");
 }
 });

server.listen(5000, () => {
 console.log("🚀 Server running at http://localhost:5000");
 });
}

main().catch(console.error);