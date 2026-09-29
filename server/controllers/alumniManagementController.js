const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const XLSX = require("xlsx");

const User = require("../models/User");

// ======================================================
// STAFF CHECK HELPER
// ======================================================

const checkStaff = (req, res) => {
  if (req.user?.role !== "staff") {
    res.status(403).json({
      success: false,
      message: "Only staff can manage alumni records",
    });

    return false;
  }

  return true;
};

// ======================================================
// GET ALL ALUMNI
// SEARCH + YEAR + SORT + PAGINATION
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
      parseInt(req.query.limit) || 100,
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
      message:
        "Unable to fetch alumni details",
    });
  }
};

// ======================================================
// ADD ONE ALUMNI MANUALLY
// STAFF ONLY
// ======================================================

const addAlumni = async (req, res) => {
  try {
    if (!checkStaff(req, res)) {
      return;
    }

    const {
      name,
      email,
      password,
      department,
      passingYear,
      phone,
      about,
      skills,
      company,
      designation,
      location,
      experience,
      careerInterest,
      linkedinUrl,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!passingYear) {
      return res.status(400).json({
        success: false,
        message: "Passing year is required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "This email is already registered",
      });
    }

    const rawPassword =
      password?.trim() || "Alumni@123";

    const hashedPassword =
      await bcrypt.hash(rawPassword, 10);

    const alumni = await User.create({
      name: name.trim(),

      email: normalizedEmail,

      password: hashedPassword,

      role: "alumni",

      department:
        department?.trim() ||
        "B.Sc Computer Science",

      passingYear:
        String(passingYear).trim(),

      phone:
        phone?.trim() || "",

      about:
        about?.trim() || "",

      skills:
        Array.isArray(skills)
          ? skills
          : typeof skills === "string"
          ? skills
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],

      company:
        company?.trim() || "",

      designation:
        designation?.trim() || "",

      location:
        location?.trim() || "",

      experience:
        experience?.trim() || "",

      careerInterest:
        careerInterest?.trim() || "",

      linkedinUrl:
        linkedinUrl?.trim() || "",
    });

    const userData =
      alumni.toObject();

    delete userData.password;

    res.status(201).json({
      success: true,

      message:
        "Alumni added successfully",

      user: userData,
    });
  } catch (error) {
    console.error(
      "ADD ALUMNI ERROR:",
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
      message:
        "Unable to add alumni",
    });
  }
};

// ======================================================
// IMPORT ALUMNI FROM EXCEL
// STAFF ONLY
// ======================================================

const importAlumniFromExcel = async (
  req,
  res
) => {
  try {
    if (!checkStaff(req, res)) {
      return;
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload an Excel file",
      });
    }

    const workbook =
      XLSX.read(req.file.buffer, {
        type: "buffer",
      });

    const firstSheetName =
      workbook.SheetNames[0];

    if (!firstSheetName) {
      return res.status(400).json({
        success: false,
        message:
          "Excel file does not contain a sheet",
      });
    }

    const worksheet =
      workbook.Sheets[firstSheetName];

    const rows =
      XLSX.utils.sheet_to_json(
        worksheet,
        {
          defval: "",
        }
      );

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message:
          "Excel file is empty",
      });
    }

    let added = 0;
    let skipped = 0;

    const skippedRows = [];

    for (
      let index = 0;
      index < rows.length;
      index++
    ) {
      const row = rows[index];

      const name = String(
        row.name ??
          row.Name ??
          row.NAME ??
          ""
      ).trim();

      const email = String(
        row.email ??
          row.Email ??
          row.EMAIL ??
          ""
      )
        .trim()
        .toLowerCase();

      const passingYear = String(
        row.passingYear ??
          row.PassingYear ??
          row["Passing Year"] ??
          row.passing_year ??
          ""
      ).trim();

      if (!name || !email || !passingYear) {
        skipped++;

        skippedRows.push({
          row: index + 2,
          reason:
            "Name, email or passing year missing",
        });

        continue;
      }

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        skipped++;

        skippedRows.push({
          row: index + 2,
          email,
          reason:
            "Email already registered",
        });

        continue;
      }

      const passwordValue =
        String(
          row.password ??
            row.Password ??
            "Alumni@123"
        ).trim();

      const hashedPassword =
        await bcrypt.hash(
          passwordValue,
          10
        );

      const skillsValue =
        row.skills ??
        row.Skills ??
        "";

      let skills = [];

      if (Array.isArray(skillsValue)) {
        skills = skillsValue;
      } else if (
        typeof skillsValue === "string"
      ) {
        skills = skillsValue
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);
      }

      await User.create({
        name,

        email,

        password: hashedPassword,

        role: "alumni",

        department:
          String(
            row.department ??
              row.Department ??
              "B.Sc Computer Science"
          ).trim(),

        passingYear,

        phone:
          String(
            row.phone ??
              row.Phone ??
              ""
          ).trim(),

        company:
          String(
            row.company ??
              row.Company ??
              ""
          ).trim(),

        designation:
          String(
            row.designation ??
              row.Designation ??
              ""
          ).trim(),

        location:
          String(
            row.location ??
              row.Location ??
              ""
          ).trim(),

        experience:
          String(
            row.experience ??
              row.Experience ??
              ""
          ).trim(),

        careerInterest:
          String(
            row.careerInterest ??
              row.CareerInterest ??
              row["Career Interest"] ??
              ""
          ).trim(),

        about:
          String(
            row.about ??
              row.About ??
              ""
          ).trim(),

        linkedinUrl:
          String(
            row.linkedinUrl ??
              row.LinkedIn ??
              row["LinkedIn URL"] ??
              ""
          ).trim(),

        skills,
      });

      added++;
    }

    res.status(200).json({
      success: true,

      message:
        "Excel import completed",

      summary: {
        totalRows: rows.length,
        added,
        skipped,
      },

      skippedRows,
    });
  } catch (error) {
    console.error(
      "EXCEL IMPORT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to import Excel file",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE ALUMNI
// STAFF ONLY
// ======================================================

const updateAlumni = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({
        success: false,
        message:
          "Only staff can update alumni records",
      });
    }

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid alumni ID",
      });
    }

    const alumni =
      await User.findOne({
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

    allowedFields.forEach(
      (field) => {
        if (
          req.body[field] !==
          undefined
        ) {
          alumni[field] =
            req.body[field];
        }
      }
    );

    if (
      !alumni.name ||
      !alumni.name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Alumni name is required",
      });
    }

    if (
      !alumni.email ||
      !alumni.email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required",
      });
    }

    alumni.email =
      alumni.email
        .toLowerCase()
        .trim();

    const existingUser =
      await User.findOne({
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

    const updatedAlumni =
      await alumni.save();

    const userData =
      updatedAlumni.toObject();

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
      message:
        "Unable to update alumni",
    });
  }
};

// ======================================================
// DELETE ALUMNI
// STAFF ONLY
// ======================================================

const deleteAlumni = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({
        success: false,
        message:
          "Only staff can delete alumni records",
      });
    }

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid alumni ID",
      });
    }

    const alumni =
      await User.findOne({
        _id: id,
        role: "alumni",
      });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message:
          "Alumni not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,

      message:
        "Alumni deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE ALUMNI ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete alumni",
    });
  }
};

// ======================================================
// GET ALL STUDENTS
// ======================================================

const getAllStudents = async (
  req,
  res
) => {
  try {
    const students =
      await User.find({
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
      message:
        "Unable to fetch students",
    });
  }
};

// ======================================================
// GET ALL NETWORK MEMBERS
// ======================================================

const getAllNetworkMembers =
  async (req, res) => {
    try {
      const users =
        await User.find({
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
// ======================================================

const getMyProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
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
// ======================================================

const updateProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    const allowedFields = [
      "name",
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

    allowedFields.forEach(
      (field) => {
        if (
          req.body[field] !==
          undefined
        ) {
          user[field] =
            req.body[field];
        }
      }
    );

    if (
      !user.name ||
      !user.name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name is required",
      });
    }

    user.name =
      user.name.trim();

    const updatedUser =
      await user.save();

    const userData =
      updatedUser.toObject();

    delete userData.password;

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
  addAlumni,
  importAlumniFromExcel,
};