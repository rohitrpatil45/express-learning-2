import mongoose from "mongoose";

// schema = rules/blueprint for users
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }
});

// model = actual object to work with in code
const User = mongoose.model("User", userSchema);

export default User;
