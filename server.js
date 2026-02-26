const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads folder if not exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Upload photo
app.post("/upload", upload.single("photo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({ photoPath: `/uploads/${req.file.filename}` });
});

// In-memory storage
let items = [];
let idCounter = 1;

// Save item
app.post("/save-item", (req, res) => {
    const { name, location, date, contact, type, description, photo } = req.body;

    if (!name || !location) {
        return res.status(400).json({ error: "Name and location required" });
    }

    const item = {
        id: idCounter++,
        name,
        location,
        date,
        contact,
        type,
        description,
        photo
    };

    items.push(item);

    res.json({ success: true, item });
});

// Get all items
app.get("/items", (req, res) => {
    res.json(items);
});

// View single photo page
app.get("/view-photo/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(i => i.id === id);

    if (!item || !item.photo) {
        return res.send("Photo not found");
    }

    res.send(`
        <html>
            <head>
                <title>View Photo</title>
                <style>
                    body {
                        text-align: center;
                        background: #f4f4f4;
                        font-family: Arial;
                    }
                    img {
                        margin-top: 50px;
                        max-width: 80%;
                        height: auto;
                        border-radius: 10px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                    }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        text-decoration: none;
                        color: white;
                        background: #3a7bd5;
                        padding: 10px 20px;
                        border-radius: 6px;
                    }
                </style>
            </head>
            <body>
                <h2>${item.name} - Photo</h2>
                <img src="${item.photo}" />
                <br>
                <a href="/">⬅ Back</a>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
app.use("/api", require("./routes/statsRoutes"));