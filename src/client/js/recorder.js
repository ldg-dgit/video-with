import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startRecBtn = document.getElementById("startRecBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  await ffmpeg.run("-i", "recording.webm", "-ss", "00:00:01", "-frames:v", "1", "thumbnail.png");

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const pngFile = ffmpeg.FS("readFile", "thumbnail.png");

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const pngBlob = new Blob([pngFile.buffer], { type: "image/png" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const pngUrl = URL.createObjectURL(pngBlob);

  const mp4A = document.createElement("a");
  mp4A.href = mp4Url;
  mp4A.download = "recording.mp4";
  document.body.appendChild(mp4A);
  mp4A.click();

  const pngA = document.createElement("a");
  pngA.href = pngUrl;
  pngA.download = "thumbnail.png";
  document.body.appendChild(pngA);
  pngA.click();

  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.png");

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(pngUrl);
  URL.revokeObjectURL(videoFile);
};

const handleStartRec = () => {
  startRecBtn.innerText = "Stop Recording";
  startRecBtn.removeEventListener("click", handleStartRec);
  startRecBtn.addEventListener("click", handleStopRec);
  recorder = new window.MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const handleStopRec = () => {
  startRecBtn.innerText = "Download Recording";
  startRecBtn.removeEventListener("click", handleStopRec);
  startRecBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startRecBtn.addEventListener("click", handleStartRec);
