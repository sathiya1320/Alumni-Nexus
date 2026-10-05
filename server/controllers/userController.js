const mongoose = require("mongoose");
const User = require("../models/User");

// ======================================================
// GET ALL ALUMNI
// ======================================================

const getAllAlumni = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const year = (req.query.year || "").trim();

    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      parseInt(req.query.limit) || 50,
      100
    );

    const skip = (page - 1) * limit;

    const query = {
      role: "alumni",
    };

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
        {
          department: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (year) {
      query.passingYear = year;
    }

    const total = await User.countDocuments(query);

    const alumni = await User.find(query)
      .select("-password")
      .sort({
        passingYear: -1,
        name: 1,
      })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      alumni,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: total,
        recordsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });

  } catch (error) {
    console.error(
      "GET ALL ALUMNI ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch alumni",
    });
  }
};


// ======================================================
// GET ALUMNI BY ID
// ======================================================

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alumni ID",
      });
    }

    const alumni = await User.findOne({
      _id: id,
      role: "alumni",
    }).select("-password");

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    res.status(200).json({
      success: true,
      user: alumni,
    });

  } catch (error) {
    console.error(
      "GET ALUMNI BY ID ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch alumni details",
    });
  }
};


// ======================================================
// UPDATE ALUMNI
// STAFF ONLY
// ======================================================

const updateAlumni = async (req, res) => {
  try {
    if (
      !req.user ||
      req.user.role !== "staff"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only staff can update alumni records",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alumni ID",
      });
    }

    const alumni = await User.findOne({
      _id: id,
      role: "alumni",
    });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    const allowedFields = [
      "name",
      "email",
      "department",
      "passingYear",
      "phone",
      "about",
      "skills",
      "company",
      "designation",
      "location",
      "experience",
      "careerInterest",
      "linkedinUrl",
      "resumeUrl",
      "resumeName",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        alumni[field] = req.body[field];
      }
    });

    if (
      !alumni.name ||
      !alumni.name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Alumni name is required",
      });
    }

    if (
      !alumni.email ||
      !alumni.email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    alumni.name = alumni.name.trim();

    alumni.email = alumni.email
      .toLowerCase()
      .trim();

    const existingUser = await User.findOne({
      email: alumni.email,
      _id: {
        $ne: alumni._id,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "This email is already registered",
      });
    }

    const updatedAlumni = await alumni.save();

    const userData = updatedAlumni.toObject();

    delete userData.password;

    res.status(200).json({
      success: true,
      message:
        "Alumni details updated successfully",
      user: userData,
    });

  } catch (error) {
    console.error(
      "UPDATE ALUMNI ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "This email is already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to update alumni",
    });
  }
};


// ======================================================
// DELETE ALUMNI
// STAFF ONLY
// ======================================================

const deleteAlumni = async (req, res) => {
  try {
    if (
      !req.user ||
      req.user.role !== "staff"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only staff can delete alumni records",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alumni ID",
      });
    }

    const alumni = await User.findOneAndDelete({
      _id: id,
      role: "alumni",
    });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alumni deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE ALUMNI ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete alumni",
    });
  }
};


// ======================================================
// GET ALL STUDENTS
// ======================================================

const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    })
      .select("-password")
      .sort({
        name: 1,
      });

    res.status(200).json({
      success: true,
      students,
    });

  } catch (error) {
    console.error(
      "GET STUDENTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch students",
    });
  }
};


// ======================================================
// GET NETWORK MEMBERS
// ======================================================

const getAllNetworkMembers = async (req, res) => {
  try {
    const users = await User.find({
      role: {
        $in: [
          "student",
          "alumni",
        ],
      },
    })
      .select("-password")
      .sort({
        name: 1,
      });

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    console.error(
      "GET NETWORK MEMBERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch network members",
    });
  }
};


// ======================================================
// GET MY PROFILE
// STUDENT / ALUMNI / STAFF
// ======================================================

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(
      "GET PROFILE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch profile",
    });
  }
};


// ======================================================
// UPDATE MY PROFILE
// STUDENT / ALUMNI / STAFF
// ======================================================

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // ==========================================
    // COMMON PROFILE FIELDS
    // ==========================================

    const commonFields = [
      "name",
      "phone",
      "location",
      "about",
      "skills",
      "company",
      "designation",
      "experience",
      "careerInterest",
      "linkedinUrl",
      "resumeUrl",
      "resumeName",
    ];

    commonFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });


    // ==========================================
    // STUDENT / ALUMNI EDUCATION
    // ==========================================

    if (
      user.role === "student" ||
      user.role === "alumni"
    ) {
      if (
        req.body.department !== undefined
      ) {
        user.department =
          req.body.department;
      }

      if (
        req.body.passingYear !== undefined
      ) {
        user.passingYear =
          req.body.passingYear;
      }
    }


    // ==========================================
    // STAFF PROFILE FIELDS
    // ==========================================

    if (user.role === "staff") {

      if (
        req.body.department !== undefined
      ) {
        user.department =
          req.body.department;
      }

      if (
        req.body.qualification !== undefined
      ) {
        user.qualification =
          req.body.qualification;
      }

      if (
        req.body.specialization !== undefined
      ) {
        user.specialization =
          req.body.specialization;
      }

      if (
        req.body.dateOfJoining !== undefined
      ) {
        user.dateOfJoining =
          req.body.dateOfJoining;
      }

      if (
        req.body.institution !== undefined
      ) {
        user.institution =
          req.body.institution;
      }

    }


    // ==========================================
    // VALIDATE NAME
    // ==========================================

    if (
      !user.name ||
      !user.name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    user.name = user.name.trim();


    // ==========================================
    // NORMALIZE SKILLS
    // ==========================================

    if (
      typeof user.skills === "string"
    ) {
      user.skills = user.skills
        .split(",")
        .map(
          (skill) => skill.trim()
        )
        .filter(
          (skill) => skill.length > 0
        );
    }


    // ==========================================
    // SAVE
    // ==========================================

    const updatedUser =
      await user.save();


    // ==========================================
    // REMOVE PASSWORD
    // ==========================================

    const userData =
      updatedUser.toObject();

    delete userData.password;


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      user: userData,
    });

  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update profile",
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  getAllAlumni,
  getAllStudents,
  getAllNetworkMembers,
  getMyProfile,
  updateProfile,
  getUserById,
  updateAlumni,
  deleteAlumni,
};