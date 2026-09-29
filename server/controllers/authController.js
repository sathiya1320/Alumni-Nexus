const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");


// =====================================================
// GENERATE JWT
// =====================================================

const generateToken = (user) => {

  return jwt.sign(

    {
      id: user._id,
      role: user.role,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }

  );

};


// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      department,
      passingYear,
    } = req.body;


    // ================================================
    // VALIDATION
    // ================================================

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        message:
          "Name, email and password are required.",

      });

    }


    // ================================================
    // CHECK EXISTING USER
    // ================================================

    const existingUser =
      await User.findOne({
        email: email.toLowerCase().trim(),
      });


    if (existingUser) {

      return res.status(400).json({

        message:
          "Email already registered.",

      });

    }


    // ================================================
    // VALIDATE ROLE
    // ================================================

    const validRoles = [
      "student",
      "alumni",
      "staff",
    ];


    const selectedRole =
      validRoles.includes(role)
        ? role
        : "student";


    // ================================================
    // CREATE USER
    // ================================================

    const user = await User.create({

      name: name.trim(),

      email: email.toLowerCase().trim(),

      password,

      role: selectedRole,

      department:
        department || "",

      passingYear:
        passingYear || "",

    });


    // ================================================
    // JWT
    // ================================================

    const token =
      generateToken(user);


    // ================================================
    // RESPONSE
    // ================================================

    return res.status(201).json({

      message:
        "Registration successful.",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        department:
          user.department,

        passingYear:
          user.passingYear,

      },

    });

  } catch (error) {

    console.error(
      "REGISTER ERROR:",
      error
    );


    return res.status(500).json({

      message:
        "Registration failed.",

      error:
        error.message,

    });

  }

};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // ================================================
    // VALIDATION
    // ================================================

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({

        message:
          "Email and password are required.",

      });

    }


    // ================================================
    // FIND USER
    // ================================================

    const user =
      await User.findOne({

        email:
          email.toLowerCase().trim(),

      });


    if (!user) {

      return res.status(401).json({

        message:
          "Invalid email or password.",

      });

    }


    // ================================================
    // CHECK PASSWORD
    // ================================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {

      return res.status(401).json({

        message:
          "Invalid email or password.",

      });

    }


    // ================================================
    // GENERATE TOKEN
    // ================================================

    const token =
      generateToken(user);


    // ================================================
    // RESPONSE
    // ================================================

    return res.status(200).json({

      message:
        "Login successful.",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        department:
          user.department,

        passingYear:
          user.passingYear,

        phone:
          user.phone,

        location:
          user.location,

        about:
          user.about,

        company:
          user.company,

        designation:
          user.designation,

        experience:
          user.experience,

        careerInterest:
          user.careerInterest,

        skills:
          user.skills,

        linkedinUrl:
          user.linkedinUrl,

        resumeUrl:
          user.resumeUrl,

        resumeName:
          user.resumeName,

      },

    });

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );


    return res.status(500).json({

      message:
        "Login failed.",

      error:
        error.message,

    });

  }

};


// =====================================================
// ⭐ FORGOT PASSWORD
// =====================================================

const forgotPassword = async (
  req,
  res
) => {

  try {

    const {
      email,
    } = req.body;


    // ================================================
    // VALIDATION
    // ================================================

    if (!email) {

      return res.status(400).json({

        message:
          "Email address is required.",

      });

    }


    const cleanEmail =
      email.toLowerCase().trim();


    // ================================================
    // FIND USER
    // ================================================

    const user =
      await User.findOne({
        email: cleanEmail,
      });


    if (!user) {

      return res.status(404).json({

        message:
          "No account found with this email address.",

      });

    }


    // ================================================
    // GENERATE RANDOM TOKEN
    // ================================================

    const resetToken =
      crypto.randomBytes(32).toString("hex");


    // ================================================
    // HASH TOKEN BEFORE DB STORAGE
    // ================================================

    const resetTokenHash =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");


    // ================================================
    // TOKEN EXPIRY
    // 15 MINUTES
    // ================================================

    user.resetPasswordTokenHash =
      resetTokenHash;


    user.resetPasswordExpires =
      new Date(
        Date.now() + 15 * 60 * 1000
      );


    await user.save({
      validateBeforeSave: false,
    });


    // ================================================
    // DEVELOPMENT RESPONSE
    // ================================================
    //
    // Since email service is not configured yet,
    // token is returned for local project testing.
    //
    // Production-la email service use pannalaam.
    // ================================================

    return res.status(200).json({

      message:
        "Password reset request created successfully.",

      resetToken,

      expiresIn:
        "15 minutes",

    });

  } catch (error) {

    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );


    return res.status(500).json({

      message:
        "Unable to process password reset request.",

      error:
        error.message,

    });

  }

};


// =====================================================
// ⭐ RESET PASSWORD
// =====================================================

const resetPassword = async (
  req,
  res
) => {

  try {

    const {
      token,
      password,
    } = req.body;


    // ================================================
    // VALIDATION
    // ================================================

    if (!token || !password) {

      return res.status(400).json({

        message:
          "Reset token and new password are required.",

      });

    }


    // ================================================
    // PASSWORD LENGTH
    // ================================================

    if (password.length < 6) {

      return res.status(400).json({

        message:
          "Password must contain at least 6 characters.",

      });

    }


    // ================================================
    // HASH RECEIVED TOKEN
    // ================================================

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");


    // ================================================
    // FIND USER WITH VALID TOKEN
    // ================================================

    const user =
      await User.findOne({

        resetPasswordTokenHash:
          tokenHash,

        resetPasswordExpires: {
          $gt: new Date(),
        },

      });


    if (!user) {

      return res.status(400).json({

        message:
          "Invalid or expired reset token.",

      });

    }


    // ================================================
    // UPDATE PASSWORD
    // ================================================

    user.password =
      password;


    // ================================================
    // CLEAR RESET TOKEN
    // ================================================

    user.resetPasswordTokenHash =
      null;


    user.resetPasswordExpires =
      null;


    // ================================================
    // SAVE
    // bcrypt pre-save hook will hash password
    // ================================================

    await user.save();


    return res.status(200).json({

      message:
        "Password reset successful. You can now login.",

    });

  } catch (error) {

    console.error(
      "RESET PASSWORD ERROR:",
      error
    );


    return res.status(500).json({

      message:
        "Unable to reset password.",

      error:
        error.message,

    });

  }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  register,

  login,

  forgotPassword,

  resetPassword,

};