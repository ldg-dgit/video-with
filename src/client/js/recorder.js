import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

import { beforeDownload } from "../../server.js";

const startRecBtn = document.getElementById("startRecBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  const { createFFmpeg } = FFmpeg;
  const ffmpeg = createFFmpeg({
    corePath: "http://localhost:4000/public/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", "recording.webm", await fetch(videoFile));

  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "My Recording.webm";
  document.body.appendChild(a);
  a.click();
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
