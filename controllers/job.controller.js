import Job from "../models/job.model.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      experienceLevel,
      location,
      jobType,
      companyName,
      companyLogo,
    } = req.body;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !experienceLevel ||
      !location ||
      !jobType ||
      !companyName ||
      !companyLogo
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements?.split(","),
      salary: Number(salary),
      experienceLevel,
      location,
      jobType,
      companyName,
      companyLogo,
      createdBy: req.userId,
    });
    return res.status(200).json({
      message: "Job created succesfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const job = await Job.find(query).sort({ createdAt: -1 });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate("createdBy");
    if (!job) { 
      return res.status(404).json({
        message: "Job not found",
        success: false,
      }); 
    }
    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const userId = req.userId;
    const job = await Job.find({ createdBy: userId }).sort({ createdAt: -1 });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteJobByAdmin = async (req, res) => {
  try {
    const userId = req.userId;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    if (job.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this job",
        success: false,
      });
    }

    await Job.findByIdAndDelete(jobId);
    return res.status(200).json({
      message: "Job deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


export const updateJobByAdmin = async (req, res) => {
  try {
    const userId = req.userId;
    const jobId = req.params.id;

    const existingJob = await Job.findById(jobId);

    if (!existingJob) {
      return res.status(404).json({ 
        message: "Job not found",
        success: false,
      });
    }

    if (existingJob.createdBy.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to update this job",
        success: false,
      });
    }

    const {
      title,
      description,
      requirements,
      salary,
      experienceLevel,
      location,
      jobType,
      companyName,
      companyLogo,
    } = req.body;

    // Update only if provided
    existingJob.title = title || existingJob.title;
    existingJob.description = description || existingJob.description;
    existingJob.requirements = requirements
      ? requirements.split(",")
      : existingJob.requirements;
    existingJob.salary = salary || existingJob.salary;
    existingJob.experienceLevel =
      experienceLevel || existingJob.experienceLevel;
    existingJob.location = location || existingJob.location;
    existingJob.jobType = jobType || existingJob.jobType;
    existingJob.companyName = companyName || existingJob.companyName;
    existingJob.companyLogo = companyLogo || existingJob.companyLogo;

    await existingJob.save();

    return res.status(200).json({
      message: "Job updated successfully",
      success: true,
      job: existingJob,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
