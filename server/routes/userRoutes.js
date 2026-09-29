const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {

  getAllAlumni,

  getAllStudents,

  getAllNetworkMembers,

  getMyProfile,

  updateProfile,

  getUserById,

  updateAlumni,

  deleteAlumni

} = require(
  "../controllers/userController"
);


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const {

  protect

} = require(
  "../middleware/authMiddleware"
);

const {
  staffOnly
} = require(
  "../middleware/staffMiddleware"
);



// ==================================================
// ALUMNI MANAGEMENT
// ==================================================


// GET ALL ALUMNI
//
// Example:
//
// /api/users/alumni
//
// Search:
//
// /api/users/alumni?search=Afshana
//
// Year:
//
// /api/users/alumni?year=2027
//
// Search + year:
//
// /api/users/alumni?search=google&year=2027
//
// Pagination:
//
// /api/users/alumni?page=1&limit=50
//

router.get(

  "/alumni",

  protect,

  getAllAlumni

);



// ==================================================
// STAFF EDIT ALUMNI
// ==================================================

router.put(
  "/alumni/:id",
  protect,
  staffOnly,
  updateAlumni
);


// ==================================================
// STAFF DELETE ALUMNI
// ==================================================

router.delete(
  "/alumni/:id",
  protect,
  staffOnly,
  deleteAlumni
);



// ==================================================
// GET ALL STUDENTS
// ==================================================

router.get(

  "/students",

  protect,

  getAllStudents

);



// ==================================================
// GET NETWORK MEMBERS
// ==================================================

router.get(

  "/network",

  protect,

  getAllNetworkMembers

);



// ==================================================
// MY PROFILE
// ==================================================

router.get(

  "/profile",

  protect,

  getMyProfile

);



// ==================================================
// UPDATE MY PROFILE
// ==================================================

router.put(

  "/profile",

  protect,

  updateProfile

);



// ==================================================
// GET USER BY ID
//
// IMPORTANT:
// Keep this route LAST.
// ==================================================

router.get(

  "/:id",

  protect,

  getUserById

);



module.exports = router;