// models/User.ts
import mongoose, { Document, Model } from "mongoose";

interface IResolve extends Document {
  complaintId: string;
  response: string;
  updated: Date;
  created: Date;
}

const ResolveSchema = new mongoose.Schema<IResolve>({
  complaintId: { type: String, required: true },
  response: { type: String, required: true },
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
});

// Use existing model if it exists (hot-reload safe)
const Resolve: Model<IResolve> = mongoose.models.Resolve || mongoose.model<IResolve>("Resolve", ResolveSchema);

export default Resolve;
