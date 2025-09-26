// models/User.ts
import mongoose, { Document, Model } from "mongoose";

interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  password: string;
  updated: Date;
  created: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
});

// Use existing model if it exists (hot-reload safe)
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
