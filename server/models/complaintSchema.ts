// models/User.ts
import mongoose, { Document, Model } from "mongoose";

interface IComplaint extends Document {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  complaintDetail: string;
  complaintStatus: string;
  updated: Date;
  created: Date;
}

const complaintSchema = new mongoose.Schema<IComplaint>({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  complaintDetail: { type: String, required: true },
  complaintStatus: { type: String, required: true },
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
});

// Use existing model if it exists (hot-reload safe)
const Complaint: Model<IComplaint> = mongoose.models.Complaint || mongoose.model<IComplaint>("Complaint", complaintSchema);

export default Complaint;
