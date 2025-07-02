import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    enum: ["Student", "Recruiter"] 
  },

  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    // required: true,
  },

//   profile option
  profile: {
    profilePhoto: {
      type: String,
      default: ""
    },
    skill: {
      type: [String],
      default: []
    },
    bio: {
      type: String,
      default: ""
    }
  }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User