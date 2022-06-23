// Import external module
const ytdl = require("ytdl-core");

// Downloader controller
const downloaderController = {};

// Get downloader UI
downloaderController.downloaderUI = async (req, res, next) => {
  try {
    res.status(200).render("index");
  } catch (err) {
    next(err);
  }
};

// Get video info
downloaderController.videoInfo = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    const info = await ytdl.getInfo(
      `https://www.youtube.com/watch?v=${videoId}`
    );

    res.json(info);
  } catch (err) {
    next(err);
  }
};

// Download video
downloaderController.downloadVideo = async (req, res, next) => {
  try {
    const { title, videoId, itag } = req.params;

    const ref = `https://www.youtube.com/watch?v=${videoId}`;
    req.credential = { title, ref, itag: Number(itag) };
    next();
  } catch (err) {
    next(err);
  }
};

// Export downloader controller
module.exports = downloaderController;
