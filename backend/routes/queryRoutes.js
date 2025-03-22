const express = require("express");
const { queryContract } = require("../controllers/queryController");

const router = express.Router();
router.post("/", queryContract);
module.exports = router;