import express from "express";
import session from "express-session";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import { localMiddleware } from "./middlewares";

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localMiddleware);
app.use("/", rootRouter);
app.use("/upload", express.static("upload"));
app.use("/static", express.static("assets"));
app.use("/video", videoRouter);
app.use("/user", userRouter);

export default app;
