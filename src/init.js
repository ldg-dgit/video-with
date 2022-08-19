import "regenerator-runtime";
import "dotenv/config";
import "./db.js";
import "./models/User.js";
import "./models/Video.js";
import "./models/Comment.js";
import app from "./server.js";

const PORT = process.env.PORT || 3000;

const handleListening = () => console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
