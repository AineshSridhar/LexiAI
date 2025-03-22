const express = require("express");
const { processFile } = require("../controllers/uploadController");
const upload = require("../utils/multerConfig");

const router = express.Router();
router.post("/", upload.single("file"), processFile);
module.exports = router;