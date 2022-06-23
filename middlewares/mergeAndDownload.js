// Import built-in module
const fs = require("fs");
const cp = require("child_process");

// Import external module
const ytdl = require("ytdl-core");
const ffmpeg = require("ffmpeg-static");
const { v4: uuidv4 } = require("uuid");

const mergeAndDownload = async (req, res, next) => {
  const { title, ref, itag } = req.credential;

  res.header(
    "Content-Disposition",
    `attachment;  filename=rimonians--${title}.mp4`
  );
  let audio = ytdl(ref, { quality: "highestaudio" });
  let video = ytdl(ref, { quality: itag });

  const ffmpegProcess = cp.spawn(
    ffmpeg,
    [
      "-i",
      `pipe:3`,
      "-i",
      `pipe:4`,
      "-map",
      "0:v",
      "-map",
      "1:a",
      "-c:v",
      "copy",
      "-c:a",
      "libmp3lame",
      "-crf",
      "27",
      "-preset",
      "veryfast",
      "-movflags",
      "frag_keyframe+empty_moov",
      "-f",
      "mp4",
      "-loglevel",
      "error",
      "-",
    ],
    {
      stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"],
    }
  );

  video.pipe(ffmpegProcess.stdio[3]);
  audio.pipe(ffmpegProcess.stdio[4]);
  ffmpegProcess.stdio[1].pipe(res);

  let ffmpegLogs = "";

  ffmpegProcess.stdio[2].on("data", (chunk) => {
    ffmpegLogs += chunk.toString();
  });

  ffmpegProcess.on("exit", (exitCode) => {
    if (exitCode === 1) {
      console.error(ffmpegLogs);
    }
  });
};

// Export mergeAndDownload middleware
module.exports = mergeAndDownload;
