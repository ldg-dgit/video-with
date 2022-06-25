let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 13,
    createdAt: "2 minutes ago",
    views: 5000,
    id: 0,
  },
  {
    title: "Second Video",
    rating: 3,
    comments: 3,
    createdAt: "1 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Third Video",
    rating: 4.5,
    comments: 17,
    createdAt: "1 second ago",
    views: 12000,
    id: 2,
  },
];

export const trendingVideos = (req, res) => {
  return res.render("home", { bodyTitle: "Home", videos, headTitle: "Home" });
};
export const videoWatch = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  return res.render("video_watch", { headTitle: `${video.title}`, bodyTitle: `${video.title}`, video });
};
export const videoEditGet = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  return res.render("video_edit", { headTitle: `Edit - ${video.title}`, bodyTitle: `Editing - ${video.title}`, video });
};
export const videoEditPost = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id].title = title;
  return res.redirect(`/video/${id}`);
};

export const videoUploadGet = (req, res) => {
  return res.render("upload", { headTitle: `Upload Video`, bodyTitle: `Upload Video` });
};

export const videoUploadPost = (req, res) => {
  const newVideo = {
    title: req.body.title,
    rating: 0,
    comments: 0,
    createdAt: "just now",
    views: 1,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
