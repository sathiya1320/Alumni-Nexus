const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// =====================================================
// USER SCHEMA
// =====================================================

const userSchema = new mongoose.Schema(
  {
    // ===================================================
    // BASIC INFORMATION
    // ===================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ===================================================
    // ROLE
    // ===================================================

    role: {
      type: String,
      enum: [
        "student",
        "alumni",
        "staff",
      ],
      default: "student",
    },

    // ===================================================
    // ACADEMIC INFORMATION
    // ===================================================

    department: {
      type: String,
      default: "",
      trim: true,
    },

    passingYear: {
      type: String,
      default: "",
      trim: true,
    },

    // ===================================================
    // STAFF ACADEMIC / PROFESSIONAL INFORMATION
    // ===================================================

    qualification: {
      type: String,
      default: "",
      trim: true,
    },

    specialization: {
      type: String,
      default: "",
      trim: true,
    },

    dateOfJoining: {
      type: String,
      default: "",
      trim: true,
    },

    institution: {
      type: String,
      default: "",
      trim: true,
    },

    // ===================================================
    // PERSONAL INFORMATION
    // ===================================================

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    about: {
      type: String,
      default: "",
      trim: true,
    },

    // ===================================================
    // PROFESSIONAL INFORMATION
    // ===================================================

    company: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: String,
      default: "",
      trim: true,
    },

    careerInterest: {
      type: String,
      default: "",
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    // ===================================================
    // STAFF
    // ===================================================

    staffId: {
      type: String,
      default: "",
      trim: true,
    },

    // ===================================================
    // SOCIAL / RESUME
    // ===================================================

    linkedinUrl: {
      type: String,
      default: "",
      trim: true,
    },

    resumeUrl: {
      type: String,
      default: "",
      trim: true,
    },

    resumeName: {
      type: String,
      default: "",
      trim: true,
    },

    resumeUploadedAt: {
      type: Date,
      default: null,
    },

    // ===================================================
    // PASSWORD RESET FIELDS
    // ===================================================

    resetPasswordTokenHash: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// =====================================================
// HASH PASSWORD BEFORE SAVE
// =====================================================

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

// =====================================================
// COMPARE PASSWORD
// =====================================================

userSchema.methods.comparePassword = async function (
  enteredPassword
) {
  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};

module.exports = mongoose.model(
  "User",
  userSchema
);