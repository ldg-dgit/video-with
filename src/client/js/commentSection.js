const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const btn = form.querySelector("button");

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  await fetch(`/api/video/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  //window.location.reload();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
