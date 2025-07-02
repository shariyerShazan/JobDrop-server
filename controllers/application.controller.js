import Application from "../models/application.model.js"
import Job from "../models/job.model.js"

export const applyJob = async (req , res)=>{
   try {
    const userId = req.userId 
    const jobId = req.params.id 
    if(!jobId){
        return res.status(404).json({
            message :"Job id is required",
            success: false
        })
    }
    const existingApplicant = await Application.findOne({job: jobId , applicant: userId})
    if (existingApplicant) {
        return res.status(400).json({
            message: "You have already applied for this jobs",
            success: false
        });
    }
     const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({
            message: "Job not found",
            success: false
        })
    }
    const newApplication = await Application.create({
        job:jobId,
        applicant:userId,
    });

    job.applications.push(newApplication._id);
    await job.save();
    return res.status(201).json({
        message:"Job applied successfully.",
        success:true
    })
   } catch (error) {
    console.log(error)
   }
}

export const getAppliedJobForStudent = async (req , res)=>{
     try {
        const userId = req.userId
        const application = await Application.find({ applicant: userId })
        .populate({
          path: "job",
          populate: {
            path: "createdBy",
            model: "User"
          }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application, 
            success:true
        })
     } catch (error) {
        console.log(error)
     } 
}

export const getApplicantForAdmin = async (req, res) => {
    try {
      const userId = req.userId;
  
      const jobs = await Job.find({ createdBy: userId }).populate({
        path: "applications",
        populate: { path: "applicant" }, 
      });
  
      if (!jobs || jobs.length === 0) {
        return res.status(404).json({
          message: "No jobs found for this recruiter.",
          success: false,
        });
      }
      return res.status(200).json({
        jobs,
        success: true,
      }); 
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong",
        success: false,
      });
    }
  };
  

export const updateStatus = async (req , res)=>{
   try {
    const {status} = req.body
    const applicationId = req.params.id
    if(!status){
        return res.status(400).json({
            message:'status is required',
            success:false
        })
    };
    const application = await Application.findOne({_id:applicationId});
    if(!application){
        return res.status(404).json({
            message:"Application not found.",
            success:false
        })
    };

    application.status = status;
    await application.save();

    return res.status(200).json({
        message:"Status updated successfully.",
        success:true
    });
   } catch (error) {
    console.log(error)
   }
}



