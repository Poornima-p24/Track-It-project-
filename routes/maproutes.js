const express = require("express");
const router = express.Router();

router.get("/map", (req, res) => {
    const id = req.query.id;

    res.send(`
        <h2>Item Location</h2>
        <p>Item ID: ${id}</p>
        <iframe
            width="600"
            height="400"
            src="https://www.google.com/maps?q=13.0827,80.2707&output=embed">
        </iframe>
    `);
});

module.exports = router;