import mongoose from "mongoose";

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 300,
  },
  avatar: String,
});

export default mongoose.model<IUser>("user", userSchema);
