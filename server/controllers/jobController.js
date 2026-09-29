const mongoose = require("mongoose");

const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");
const User = require("../models/User");
const Notification = require("../models/Notification");

// =====================================================
// CREATE JOB - STAFF ONLY
// =====================================================

const createJob = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({
        message: "Only staff can create jobs",
      });
    }

    const {
      title,
      company,
      jobType,
      workMode,
      location,
      experience,
      salary,
      skills,
      description,
      requirements,
      responsibilities,
      deadline,
      applicationLink,
    } = req.body;

    if (
      !title ||
      !company ||
      !jobType ||
      !workMode ||
      !location ||
      !experience ||
      !description ||
      !deadline
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      jobType,
      workMode,
      location: location.trim(),
      experience,
      salary: salary || "",

      skills: Array.isArray(skills)
        ? skills
        : skills
        ? skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],

      description: description.trim(),
      requirements: requirements || "",
      responsibilities: responsibilities || "",
      deadline,
      applicationLink: applicationLink || "",
      createdBy: req.user._id,
      status: "Published",
    });

    return res.status(201).json({
      message: "Job published successfully",
      job,
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to create job",
    });
  }
};

// =====================================================
// GET ALL PUBLISHED JOBS
// =====================================================

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: "Published",
    })
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1,
      })
      .lean();

    const userId = req.user._id.toString();

    const result = await Promise.all(
      jobs.map(async (job) => {
        const application = await JobApplication.findOne({
          job: job._id,
          applicant: userId,
        }).lean();

        return {
          ...job,

          hasApplied: !!application,

          applicationStatus: application
            ? application.status
            : null,

          canApply: ["student", "alumni"].includes(
            req.user.role
          ),
        };
      })
    );

    return res.json(result);
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
};

// =====================================================
// GET SINGLE JOB
// =====================================================

const getJobById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(req.params.id)
      .populate("createdBy", "name email")
      .lean();

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // STAFF CANNOT APPLY
    if (req.user.role === "staff") {
      return res.json({
        ...job,
        hasApplied: false,
        applicationStatus: null,
        canApply: false,
      });
    }

    const application = await JobApplication.findOne({
      job: job._id,
      applicant: req.user._id,
    }).lean();

    return res.json({
      ...job,

      hasApplied: !!application,

      applicationStatus: application
        ? application.status
        : null,

      canApply: ["student", "alumni"].includes(
        req.user.role
      ),
    });
  } catch (error) {
    console.error("GET JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch job",
    });
  }
};

// =====================================================
// STAFF - GET ALL JOBS
// =====================================================

const getAllJobsForStaff = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({
        message: "Only staff can view job management",
      });
    }

    const jobs = await Job.find()
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1,
      });

    const result = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount =
          await JobApplication.countDocuments({
            job: job._id,
          });

        return {
          ...job.toObject(),
          applicationCount,
        };
      })
    );

    return res.json(result);
  } catch (error) {
    console.error("STAFF JOB LIST ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch staff jobs",
    });
  }
};

// =====================================================
// UPDATE JOB - STAFF
// =====================================================

const updateJob = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({
        message: "Only staff can update jobs",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const {
      title,
      company,
      jobType,
      workMode,
      location,
      experience,
      salary,
      skills,
      description,
      requirements,
      responsibilities,
      deadline,
      applicationLink,
      status,
    } = req.body;

    job.title = title ?? job.title;
    job.company = company ?? job.company;
    job.jobType = jobType ?? job.jobType;
    job.workMode = workMode ?? job.workMode;
    job.location = location ?? job.location;
    job.experience = experience ?? job.experience;
    job.salary = salary ?? job.salary;

    if (skills !== undefined) {
      job.skills = Array.isArray(skills)
        ? skills
        : skills
        ? skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [];
    }

    job.description = description ?? job.description;

    job.requirements =
      requirements ?? job.requirements;

    job.responsibilities =
      responsibilities ?? job.responsibilities;

    job.deadline = deadline ?? job.deadline;

    job.applicationLink =
      applicationLink ?? job.applicationLink;

    job.status = status ?? job.status;

    await job.save();

    return res.json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to update job",
    });
  }
};

// =====================================================
// DELETE JOB - STAFF
// =====================================================

const deleteJob = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({
        message: "Only staff can delete jobs",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await JobApplication.deleteMany({
      job: job._id,
    });

    await job.deleteOne();

    return res.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete job",
    });
  }
};

// =====================================================
// UPLOAD RESUME
// =====================================================

const uploadResume = async (req, res) => {
  try {
    if (
      !["student", "alumni"].includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message:
          "Only students and alumni can upload resume",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a resume file",
      });
    }

    const resumeUrl =
      `${req.protocol}://${req.get("host")}` +
      `/uploads/resumes/${req.file.filename}`;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.resumeUrl = resumeUrl;
    user.resumeName = req.file.originalname;
    user.resumeUploadedAt = new Date();

    await user.save();

    return res.json({
      message: "Resume uploaded successfully",

      resume: {
        url: resumeUrl,
        name: req.file.originalname,
        uploadedAt: user.resumeUploadedAt,
      },
    });
  } catch (error) {
    console.error("UPLOAD RESUME ERROR:", error);

    return res.status(500).json({
      message:
        error.message || "Resume upload failed",
    });
  }
};

// =====================================================
// UPDATE LINKEDIN
// =====================================================

const updateLinkedIn = async (req, res) => {
  try {
    if (
      !["student", "alumni"].includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message:
          "Only students and alumni can update LinkedIn",
      });
    }

    const { linkedinUrl } = req.body;

    if (!linkedinUrl) {
      return res.status(400).json({
        message:
          "LinkedIn profile URL is required",
      });
    }

    const cleanUrl = linkedinUrl.trim();

    if (
      !(
        cleanUrl.startsWith(
          "https://www.linkedin.com/"
        ) ||
        cleanUrl.startsWith(
          "https://linkedin.com/"
        )
      )
    ) {
      return res.status(400).json({
        message: "Please enter a valid LinkedIn URL",
      });
    }

    const user =
      await User.findByIdAndUpdate(
        req.user._id,
        {
          linkedinUrl: cleanUrl,
        },
        {
          new: true,
        }
      ).select("-password");

    return res.json({
      message: "LinkedIn profile updated",
      user,
    });
  } catch (error) {
    console.error("LINKEDIN ERROR:", error);

    return res.status(500).json({
      message:
        "Failed to update LinkedIn profile",
    });
  }
};

// =====================================================
// APPLY FOR JOB
// STUDENT / ALUMNI ONLY
// =====================================================

const applyForJob = async (req, res) => {
  try {
    if (
      !["student", "alumni"].includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message: "Staff members cannot apply for jobs",
      });
    }

    const { coverMessage = "" } = req.body || {};

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.status !== "Published") {
      return res.status(400).json({
        message:
          "This job is not accepting applications",
      });
    }

    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        message: "Application deadline has passed",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.resumeUrl) {
      return res.status(400).json({
        message:
          "Please upload your resume before applying",
        code: "RESUME_REQUIRED",
      });
    }

    if (!user.linkedinUrl) {
      return res.status(400).json({
        message:
          "Please add your LinkedIn profile before applying",
        code: "LINKEDIN_REQUIRED",
      });
    }

    const existingApplication =
      await JobApplication.findOne({
        job: job._id,
        applicant: user._id,
      });

    if (existingApplication) {
      return res.status(400).json({
        message:
          "You have already applied for this job",
      });
    }

    const application =
      await JobApplication.create({
        job: job._id,
        applicant: user._id,
        resumeUrl: user.resumeUrl,
        resumeName: user.resumeName,
        linkedinUrl: user.linkedinUrl,
        coverMessage: String(
          coverMessage
        ).trim(),
        status: "Applied",
      });

    // =================================================
    // SUBMITTED NOTIFICATION
    // =================================================

    await Notification.create({
      receiver: user._id,
      sender: job.createdBy,

      title: "Job Application Submitted",

      message:
        `Your application for ${job.title} at ${job.company} ` +
        `has been submitted successfully.`,

      type: "job",

      relatedId: application._id,

      jobTitle: job.title,
      companyName: job.company,
      applicationStatus: "Applied",

      isRead: false,
    });

    return res.status(201).json({
      message:
        "Job application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("APPLY JOB ERROR:", error);

    return res.status(500).json({
      message: "Failed to apply for job",
    });
  }
};

// =====================================================
// MY APPLICATIONS
// =====================================================

const getMyApplications = async (req, res) => {
  try {
    if (
      !["student", "alumni"].includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message:
          "Only students and alumni can view applications",
      });
    }

    const applications =
      await JobApplication.find({
        applicant: req.user._id,
      })
        .populate(
          "job",
          "title company jobType workMode location salary deadline"
        )
        .sort({
          appliedAt: -1,
        });

    return res.json(applications);
  } catch (error) {
    console.error("MY APPLICATIONS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

// =====================================================
// STAFF - VIEW APPLICATIONS FOR JOB
// =====================================================

const getJobApplications = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({
        message: "Only staff can view applications",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const applications =
      await JobApplication.find({
        job: job._id,
      })
        .populate(
          "applicant",
          "name email phone department passingYear linkedinUrl resumeUrl resumeName skills company designation location experience about careerInterest role"
        )
        .populate(
          "job",
          "title company jobType workMode location deadline"
        )
        .sort({
          appliedAt: -1,
        });

    return res.json(applications);
  } catch (error) {
    console.error(
      "JOB APPLICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch job applications",
    });
  }
};

// =====================================================
// STAFF - UPDATE APPLICATION STATUS
// =====================================================

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({
        message:
          "Only staff can update application status",
      });
    }

    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Selected",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    const application =
      await JobApplication.findById(
        req.params.applicationId
      ).populate("job", "title company");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.status === status) {
      return res.json({
        message:
          "Application status is already " +
          status,
        application,
      });
    }

    application.status = status;
    application.reviewedAt = new Date();

    await application.save();

    let notificationTitle =
      "Application Status Updated";

    let notificationMessage =
      `Your application for ${application.job.title} ` +
      `at ${application.job.company} is now "${status}".`;

    if (status === "Under Review") {
      notificationTitle =
        "Application Under Review";

      notificationMessage =
        `Your application for ${application.job.title} ` +
        `at ${application.job.company} is now under review.`;
    }

    if (status === "Shortlisted") {
      notificationTitle =
        "Application Shortlisted";

      notificationMessage =
        `Your application for ${application.job.title} ` +
        `at ${application.job.company} has been shortlisted.`;
    }

    if (status === "Selected") {
      notificationTitle =
        "Application Selected";

      notificationMessage =
        `Congratulations! Your application for ` +
        `${application.job.title} at ${application.job.company} ` +
        `has been selected.`;
    }

    if (status === "Rejected") {
      notificationTitle =
        "Application Rejected";

      notificationMessage =
        `Your application for ${application.job.title} ` +
        `at ${application.job.company} has been rejected.`;
    }

    await Notification.create({
      receiver: application.applicant,
      sender: req.user._id,

      title: notificationTitle,

      message: notificationMessage,

      type: "job",

      relatedId: application._id,

      jobTitle: application.job.title,

      companyName: application.job.company,

      applicationStatus: status,

      isRead: false,
    });

    return res.json({
      message:
        "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error(
      "UPDATE APPLICATION STATUS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update application status",
    });
  }
};

// =====================================================
// GET SINGLE JOB APPLICATION
// STAFF ONLY
// =====================================================

const getJobApplicationById = async (
  req,
  res
) => {
  try {
    // STAFF ONLY
    if (req.user.role !== "staff") {
      return res.status(403).json({
        message:
          "Only staff can view applicant details",
      });
    }

    const { applicationId } = req.params;

    // CHECK APPLICATION ID
    if (
      !mongoose.Types.ObjectId.isValid(
        applicationId
      )
    ) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    // FIND APPLICATION
    const application =
      await JobApplication.findById(
        applicationId
      )
        .populate(
          "applicant",
          "name email phone location department passingYear company designation experience careerInterest skills linkedinUrl resumeUrl resumeName resumeUploadedAt about role"
        )
        .populate(
          "job",
          "title company jobType workMode location experience salary deadline description requirements responsibilities applicationLink"
        );

    // APPLICATION NOT FOUND
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    console.log(
      "Applicant details loaded:",
      application._id.toString()
    );

    return res.status(200).json({
      application,
    });
  } catch (error) {
    console.error(
      "GET SINGLE APPLICATION ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load applicant details",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getAllJobsForStaff,
  updateJob,
  deleteJob,
  uploadResume,
  updateLinkedIn,
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getJobApplicationById,
};