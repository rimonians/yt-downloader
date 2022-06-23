// Import external module
const express = require("express");

// Import from downloaderController
const {
  downloaderUI,
  videoInfo,
  downloadVideo,
  test,
} = require("../controllers/downloaderController");

// Import mergeAndDownload middleware
const mergeAndDownload = require("../middlewares/mergeAndDownload");

// Initialize router
const router = express.Router();

// Get downloader UI
router.get("/", downloaderUI);

// Get video info
router.get("/info/:videoId", videoInfo);

// Download video
router.get("/download/:title/:videoId/:itag", downloadVideo, mergeAndDownload);

// Export router
module.exports = router;
