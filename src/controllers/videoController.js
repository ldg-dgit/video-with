export const trendingVideos = (req, res) => {
  const videos = [
    {
      title: "First Video",
      rating: 5,
      comments: 13,
      createdAt: "2 minutes ago",
      views: 5000,
      id: 1,
    },
    {
      title: "Second Video",
      rating: 3,
      comments: 3,
      createdAt: "1 minutes ago",
      views: 3000,
      id: 2,
    },
    {
      title: "Third Video",
      rating: 4.5,
      comments: 17,
      createdAt: "1 second ago",
      views: 12000,
      id: 3,
    },
  ];
  return res.render("home", { bodyTitle: "Home", videos, headTitle: "Home" });
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
