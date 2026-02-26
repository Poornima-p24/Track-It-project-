const express = require("express");
const Item = require("../models/Item");
const User = require("../models/User");

const router = express.Router();

router.get("/stats", async (req, res) => {
    const totalItems = await Item.countDocuments();
    const recoveredItems = await Item.countDocuments({ status: "recovered" });
    const totalUsers = await User.countDocuments();

    res.json({
        totalItems,
        recoveredItems,
        totalUsers
    });
});

module.exports = router;