const user = {
  username: "Bobby Lee",
  signin: true,
};

export const trendingVideos = (req, res) => {
  return res.render("home", { bodyTitle: "Home", user });
};
export const videoWatch = (req, res) => {
  return res.render("video_watch", { bodyTitle: "Watch" });
};
export const videoEdit = (req, res) => {
  return res.render("video_edit", { bodyTitle: "Edit" });
};
export const search = (req, res) => res.send("Search");
export const videoUpload = (req, res) => res.send("Upload Video");
export const videoDelete = (req, res) => {
  return res.send(`Delete Video #${req.params.id}`);
};
