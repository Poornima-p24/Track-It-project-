const http = require("http");
const { MongoClient } = require("mongodb");
const querystring = require("querystring");

// MongoDB URL
const url = "mongodb://127.0.0.1:27017";
const dbName = "mydbs";

// HTML Form
const formHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Register</title>
</head>
<body>
  <h2>Register Form</h2>
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

async function startServer() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(url);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);
    const usersCollection = db.collection("user");

    // Create HTTP server
    const server = http.createServer((req, res) => {

      // Show Form
      if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(formHTML);
      }

      // Handle Register
      else if (req.method === "POST" && req.url === "/register") {
        let body = "";

        req.on("data", chunk => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          try {
            const formData = querystring.parse(body);

            console.log("📥 Received Data:", formData);

            const result = await usersCollection.insertOne(formData);

            console.log("✅ Inserted ID:", result.insertedId);

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end("<h2>Registration Successful!</h2><a href='/'>Go Back</a>");

          } catch (error) {
            console.error("❌ Insert Error:", error);
            res.writeHead(500);
            res.end("Database Error");
          }
        });
      }

      // 404
      else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Page Not Found");
      }
    });

    server.listen(5000, () => {
      console.log("🚀 Server running at http://localhost:5000");
    });

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

startServer();