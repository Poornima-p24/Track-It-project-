const express = require("express");
const app = express();
const path = require("path");

// Serve static files (HTML, CSS, JS)
app.use(express.static("public"));

// Import routes
const mapRoutes = require("./routes/maproutes");

// Use routes
app.use("/", mapRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});