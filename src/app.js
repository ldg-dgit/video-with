import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

const PORT = 4000;

app.use(logger);

app.use("/", globalRouter);
app.use("/video", videoRouter);
app.use("/user", userRouter);

const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
