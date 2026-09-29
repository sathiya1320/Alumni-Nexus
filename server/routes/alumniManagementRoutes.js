const express = require("express");

const router = express.Router();

const {
  addAlumni,
  importAlumniFromExcel,
} = require(
  "../controllers/alumniManagementController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const multer = require("multer");

// ======================================================
// EXCEL UPLOAD
// MEMORY STORAGE
// ======================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    cb
  ) => {
    const allowedExtensions =
      /\.(xlsx|xls|csv)$/i;

    if (
      allowedExtensions.test(
        file.originalname
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only Excel (.xlsx, .xls) or CSV files are allowed"
        )
      );
    }
  },
});

// ======================================================
// ADD SINGLE ALUMNI
// ======================================================

router.post(
  "/add",
  protect,
  addAlumni
);

// ======================================================
// IMPORT EXCEL
// ======================================================

router.post(
  "/import",
  protect,
  upload.single("file"),
  importAlumniFromExcel
);

module.exports = router;