import dotenv from "dotenv"
dotenv.config()
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// register user
export const register = async (req, res) => {
  try {
    const { fullName, email, password , role
      //  , contactNumber
      } = req.body;

    if (!fullName || !email || !password || !role 
      // || !contactNumber
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
      
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }
    if (!/[a-zA-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one letter",
      });
    }
    if (!/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number",
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      // contactNumber
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};



// login user
export const login = async (req , res)=>{
   try {
    const {email , password , role} = req.body
    if(!email || !password || !role ){
        return res.status(400).json({
            message: "Something is missing",
            success: false
        })
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({
            message: "User not exist with this email",
            success: false
        })
    }
    if(user.role !== role){
        return res.status(404).json({
            message: "User not exist with this, 'role'"
        })
    }
    const isMatch = await bcryptjs.compare(password , user.password)
    if(!isMatch){
        return res.status(401).json({
            message: "Invalid passowrd" ,
            success: false
        })
    }
    const tokenData = { _id: user._id }
    const token = jwt.sign( tokenData, process.env.SECRET_KEY , {expiresIn: "7d"})

    return res
    .status(200)
    .cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,       
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      message: `Welcome back ${user.fullName}`,
      user,
      success: true,
    });

   } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
   }
}


export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Logout failed", success: false });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { fullName, contactNumber, bio, skill, profilePhoto } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (fullName?.trim()) user.fullName = fullName.trim();
    if (contactNumber?.trim()) user.contactNumber = contactNumber.trim();

    if (skill) {
      const skillArray = Array.isArray(skill)
        ? skill
        : skill.split(",").map(s => s.trim()).filter(Boolean);
      user.profile.skill = skillArray;
    }

    if (bio?.trim() !== undefined) user.profile.bio = bio.trim();

    if (profilePhoto?.trim()) user.profile.profilePhoto = profilePhoto.trim();

    user.markModified("profile"); 
    await user.save();

    const updatedUser = {
      _id: user._id,
      fullName: user.fullName,
      contactNumber: user.contactNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};


export const changePassword = async (req, res) => {
  try {
    const userId = req.userId; 
    const { oldPassword, newPassword } = req.body;

    // Check input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old and new passwords are required.",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Old password is incorrect.",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully.",
      success: true,
    });

  } catch (error) {
    console.error("Password Change Error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};
