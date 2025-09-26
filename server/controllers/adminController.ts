import { Request, Response } from "express";
import Complaint from "../models/complaintSchema";
import Resolve from "../models/ResolveSchema";

export const fetchAllComplaints = async (req: Request, res: Response) => {
  try {
    const complaints = await Complaint.aggregate([
      {
        $lookup: {
          from: "resolves",
          let: { cid: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$complaintId", "$$cid"] } } },
            { $sort: { updated: -1 } },
            { $limit: 1 },
          ],
          as: "resolution",
        },
      },
      {
        $unwind: {
          path: "$resolution",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { created: -1 } },
    ]);

    if (!complaints || complaints.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No complaints found",
      });
    }

    return res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error: any) {
    console.error("Error fetching all complaints:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resolveComplaint = async (req: any, res: Response) => {
  try {
    const { complaintId } = req.query; // complaintId from query params
    const { response } = req.body; // response text from admin

    // ✅ Check role
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    if (!complaintId) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID is required",
      });
    }

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Response text is required",
      });
    }

    // Check if complaint exists
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Save response in Resolve collection
    const newResolve = new Resolve({
      complaintId,
      response,
    });
    await newResolve.save();

    // Update complaint status to "Resolved"
    complaint.complaintStatus = "Resolved";
    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint resolved successfully",
      data: {
        complaint,
        resolve: newResolve,
      },
    });
  } catch (error: any) {
    console.error("Error resolving complaint:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
