import Complaint from "../models/complaintSchema";


export const raiseComplaint = async(req:any, res:any)=>{
   try {
    const { firstName,lastName, email, phoneNumber, complaintDetail} =req.body;
    const userId=req.user.id;
    if(!firstName || !lastName || !email || !phoneNumber || !complaintDetail){
        return res.status(400).json({success:false, message: "firstName, lastName, email, phoneNumber and complainDetail required"});
    }

    const raiseComplaint=new Complaint({
        userId,
        firstName,
        lastName,
        email,
        phoneNumber,
        complaintDetail,
        complaintStatus: "unresolve",
    })
    await raiseComplaint.save();
    
    return res.status(201).json({success:false,data:raiseComplaint, message: "Complaint raised"});
    
   } catch (error) {
     console.error("complaint raise to failed");
     return res.status(500).json({success:false, message: "internal server error"});
   }
}

export const fetchComplaintByUser = async(req:any, res:any)=>{
    try{
        const userId=req.user.id;
        const complaints= await Complaint.find({userId});
        if (!complaints || complaints.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No complaints found for this user",
            });
        }

        return res.status(200).json({success:true, data:complaints, message: "complaint data fetch successfully"});
    }
    catch(error){
       console.error("Error fetching complaints by user:", error.message);
        return res.status(500).json({success: false,message: "Internal server error",});
    }
}