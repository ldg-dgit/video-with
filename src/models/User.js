import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  ssoOnly: { type: Boolean, default: false },
  githubId: { type: Number },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, requierd: true },
  location: { type: String },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

export default User;
