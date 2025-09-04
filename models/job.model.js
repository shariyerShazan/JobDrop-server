import mongoose, { mongo, Mongoose } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }, 
    requirements: {
      type: [String], 
      default: [],
    },
    salary: {
      type: Number,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ["Entry level", "Mid level", "Senior"],
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Full Time", "Part Time", "Internship"],
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
