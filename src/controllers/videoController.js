export const trendingVideos = (req, res) => res.send("Trending Videos");
export const videoWatch = (req, res) => {
  return res.send(`Watch Video #${req.params.id}`);
};
export const videoEdit = (req, res) => {
  return res.send(`Edit Video #${req.params.id}`);
};
export const search = (req, res) => res.send("Search");
export const videoUpload = (req, res) => res.send("Upload Video");
export const videoDelete = (req, res) => {
  return res.send(`Delete Video #${req.params.id}`);
};
