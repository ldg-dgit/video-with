import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const handleOpen = () => console.log("✅ Connected to DB 🍃");
const handleError = (error) => console.log("❌ DB Error", error);

mongoose.connection.on("error", handleError);
mongoose.connection.once("open", handleOpen);
