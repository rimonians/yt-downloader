const videoUrl = document.querySelector("#videoUrl");
const generate = document.querySelector("#generate");

const loadingSection = document.querySelector(".loading__section");
const errorSection = document.querySelector(".error__section");
const outputSection = document.querySelector(".output__section");
const tbody = document.querySelector("tbody");

const poster = document.querySelector("#poster");
const title = document.querySelector("#title");
const duration = document.querySelector("#duration");
const channel = document.querySelector("#channel");
const upload = document.querySelector("#upload");
const view = document.querySelector("#view");

if (generate) {
  generate.addEventListener("click", () => {
    const videoUrlValue = videoUrl.value;
    const isValid = yt_url_validate(videoUrlValue);
    if (isValid) {
      fetchVideoInfo(videoUrlValue);
    } else {
      alert("Please provide valid url");
    }
  });
}

// Youtube url validation
const yt_url_validate = (url) => {
  const yt_url_validate_regex =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gi;
  return yt_url_validate_regex.test(url);
};

// Video id from youtube video url
const vid_id_from_url = (url) => {
  const vid_id_from_url_regex =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  return url.match(vid_id_from_url_regex)[1];
};

// Second to minute-second converter
const secondToOther = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

function formatBytes(a, b = 2, k = 1024) {
  with (Math) {
    let d = floor(log(a) / log(k));
    return 0 == a
      ? "0 Bytes"
      : parseFloat((a / pow(k, d)).toFixed(max(0, b))) +
          " " +
          ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d];
  }
}

// Fetch request pending
const pending = () => {
  loadingSection.style = "display:flex";
  errorSection.style = "display:none";
  outputSection.style = "display:none";
};

// Fetch request fulfilled
const fulfilled = () => {
  loadingSection.style = "display:none";
  errorSection.style = "display:none";
  outputSection.style = "display:flex";
};

// Fetch request rejected
const rejected = (err) => {
  loadingSection.style = "display:none";
  errorSection.style = "display:true";
  errorSection.querySelector("h3").textContent = err;
  outputSection.style = "display:none";
};

// Fetch video info
const fetchVideoInfo = async (videoUrlValue) => {
  try {
    pending();
    const videoId = vid_id_from_url(videoUrlValue);
    const res = await fetch(
      `https://rimon-yt-downloader.herokuapp.com/info/${videoId}`
    );
    const data = await res.json();
    const { videoDetails, formats } = data;

    poster.src =
      videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url;
    title.textContent = videoDetails.title;
    duration.textContent =
      "Duration : " + secondToOther(videoDetails.lengthSeconds);
    channel.textContent = "Channel name : " + videoDetails.ownerChannelName;
    upload.textContent = "Upload date : " + videoDetails.uploadDate;
    view.textContent = "Total views : " + videoDetails.viewCount;

    const videoTitleRegex = /[a-zA-Z\s\d]/g;
    const videoTitle = videoDetails.title.match(videoTitleRegex).join("");
    tbody.innerHTML = "";
    formats.map((format) => {
      const { qualityLabel, container, contentLength, itag, width } = format;

      if (width) {
        tbody.innerHTML += `
        <tr>
          <td>${qualityLabel}</td>
          <td>${container}</td>
          <td>${formatBytes(Number(contentLength))}</td>
          <td><a href="https://rimon-yt-downloader.herokuapp.com/download/${videoTitle}/${videoId}/${itag}">Download</a></td>
        </tr>
        `;
      }
    });

    fulfilled();
  } catch (err) {
    rejected(err);
  }
};
