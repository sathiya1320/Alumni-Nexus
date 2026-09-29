const User = require("../models/User");

// ==========================================
// GET MY PROFILE
// ==========================================

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      user
    });

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Unable to load profile"
    });
  }
};


// ==========================================
// UPDATE MY PROFILE
// ==========================================

const updateMyProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const {
      name,
      phone,
      bio,
      company,
      designation,
      skills,
      location
    } = req.body;


    // ======================================
    // UPDATE BASIC DETAILS
    // ======================================

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    if (company !== undefined) {
      user.company = company.trim();
    }

    if (designation !== undefined) {
      user.designation = designation.trim();
    }

    if (skills !== undefined) {
      user.skills = skills;
    }

    if (location !== undefined) {
      user.location = location.trim();
    }


    await user.save();


    const userResponse = user.toObject();

    delete userResponse.password;


    return res.status(200).json({
      message: "Profile updated successfully",
      user: userResponse
    });

  } catch (error) {

    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to update profile"
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getMyProfile,
  updateMyProfile
};