import "dotenv/config";
import "./db.js";
import "./models/User.js";
import "./models/Video.js";
import app from "./server.js";

const PORT = 4000;

const handleListening = () => console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
