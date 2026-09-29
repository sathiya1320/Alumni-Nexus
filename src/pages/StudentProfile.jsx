import React, {
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";

import API from "../services/api";

import "./StudentProfile.css";


function StudentProfile() {


  // =========================================
  // USER STATE
  // =========================================

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );


  // =========================================
  // PROFILE STATE
  // =========================================

  const [profile, setProfile] = useState({

    name: "",
    email: "",
    department: "",
    passingYear: "",
    phone: "",
    skills: "",
    careerInterest: "",
    about: ""

  });


  const [editMode, setEditMode] =
    useState(false);


  const [loading, setLoading] =
    useState(false);


  // =========================================
  // LOAD PROFILE FROM BACKEND
  // =========================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const token =
          localStorage.getItem("token");


        // If token doesn't exist,
        // use localStorage data

        if (!token) {

          setProfile({

            name: user.name || "",
            email: user.email || "",
            department: user.department || "",
            passingYear: user.passingYear || "",
            phone: user.phone || "",
            skills: user.skills || "",
            careerInterest:
              user.careerInterest || "",
            about: user.about || ""

          });

          return;

        }


        // Get latest data from database

        const response = await API.get(

          "/users/profile",

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );


        const latestUser =
          response.data.user;


        // Update user state

        setUser(latestUser);


        // Update localStorage

        localStorage.setItem(

          "user",

          JSON.stringify(latestUser)

        );


        // Update profile state

        setProfile({

          name:
            latestUser.name || "",

          email:
            latestUser.email || "",

          department:
            latestUser.department || "",

          passingYear:
            latestUser.passingYear || "",

          phone:
            latestUser.phone || "",

          skills:
            latestUser.skills || "",

          careerInterest:
            latestUser.careerInterest || "",

          about:
            latestUser.about || ""

        });


      } catch (error) {

        console.log(
          "PROFILE LOAD ERROR:",
          error
        );


        // Fallback to localStorage

        const storedUser =
          JSON.parse(
            localStorage.getItem("user")
          ) || {};


        setProfile({

          name:
            storedUser.name || "",

          email:
            storedUser.email || "",

          department:
            storedUser.department || "",

          passingYear:
            storedUser.passingYear || "",

          phone:
            storedUser.phone || "",

          skills:
            storedUser.skills || "",

          careerInterest:
            storedUser.careerInterest || "",

          about:
            storedUser.about || ""

        });

      }

    };


    loadProfile();


  }, []);



  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setProfile((prev) => ({

      ...prev,

      [name]: value

    }));

  };



  // =========================================
  // EDIT PROFILE
  // =========================================

  const handleEdit = () => {

    setEditMode(true);

  };



  // =========================================
  // CANCEL EDIT
  // =========================================

  const handleCancel = () => {

    setProfile({

      name:
        user.name || "",

      email:
        user.email || "",

      department:
        user.department || "",

      passingYear:
        user.passingYear || "",

      phone:
        user.phone || "",

      skills:
        user.skills || "",

      careerInterest:
        user.careerInterest || "",

      about:
        user.about || ""

    });


    setEditMode(false);

  };



  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSave = async () => {

    try {

      setLoading(true);


      const token =
        localStorage.getItem("token");


      if (!token) {

        alert(
          "Session expired. Please login again."
        );

        return;

      }


      const response = await API.put(

        "/users/profile",


        {

          name: profile.name,

          department:
            profile.department,

          passingYear:
            profile.passingYear,

          phone:
            profile.phone,

          skills:
            profile.skills,

          careerInterest:
            profile.careerInterest,

          about:
            profile.about

        },


        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      );


      const updatedUser =
        response.data.user;


      // =====================================
      // UPDATE REACT STATE
      // =====================================

      setUser(updatedUser);


      // =====================================
      // UPDATE PROFILE STATE
      // =====================================

      setProfile({

        name:
          updatedUser.name || "",

        email:
          updatedUser.email || "",

        department:
          updatedUser.department || "",

        passingYear:
          updatedUser.passingYear || "",

        phone:
          updatedUser.phone || "",

        skills:
          updatedUser.skills || "",

        careerInterest:
          updatedUser.careerInterest || "",

        about:
          updatedUser.about || ""

      });


      // =====================================
      // UPDATE LOCAL STORAGE
      // =====================================

      localStorage.setItem(

        "user",

        JSON.stringify(updatedUser)

      );


      // EXIT EDIT MODE

      setEditMode(false);


      alert(
        "Student profile updated successfully! ✅"
      );


    } catch (error) {

      console.error(

        "PROFILE UPDATE ERROR:",

        error.response?.data ||
        error.message

      );


      alert(

        error.response?.data?.message ||

        "Unable to update profile"

      );


    } finally {

      setLoading(false);

    }

  };



  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");


    window.location.href = "/login";

  };



  // =========================================
  // RETURN UI
  // =========================================

  return (

    <div className="student-profile-page">


      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside className="student-sidebar">


        <div className="student-logo">

          🎓 Alumni Nexus

        </div>


        <div className="student-label">

          STUDENT PORTAL

        </div>


        <nav>


          <Link to="/student-dashboard">

            🏠 Dashboard

          </Link>


          <Link to="/alumni">

            👥 Alumni Network

          </Link>


          <Link to="/events">

            📅 Events

          </Link>


          <Link to="/jobs">

            💼 Jobs

          </Link>


          <Link
            to="/student-profile"
            className="active"
          >

            👨‍🎓 My Profile

          </Link>


          <Link to="/notifications">

            🔔 Notifications

          </Link>


          <Link to="/settings">

            ⚙️ Settings

          </Link>


        </nav>


        <button
          className="student-logout"
          onClick={handleLogout}
        >

          🚪 Logout

        </button>


      </aside>



      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="student-profile-main">


        {/* HEADER */}

        <div className="profile-page-header">


          <div>


            <span className="profile-label">

              STUDENT PROFILE

            </span>


            <h1>

              My Profile 👨‍🎓

            </h1>


            <p>

              Manage your academic and personal information.

            </p>


          </div>



          {/* ACTION BUTTONS */}

          <div className="profile-actions">


            {!editMode ? (


              <button
                className="edit-profile-btn"
                onClick={handleEdit}
              >

                ✏️ Edit Profile

              </button>


            ) : (


              <>


                <button
                  className="cancel-profile-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >

                  Cancel

                </button>



                <button
                  className="save-profile-btn"
                  onClick={handleSave}
                  disabled={loading}
                >

                  {loading

                    ? "Saving..."

                    : "💾 Save Changes"

                  }

                </button>


              </>


            )}


          </div>


        </div>



        {/* =====================================
            PROFILE CARD
        ====================================== */}

        <section className="student-profile-card">


          {/* PROFILE HEADER */}

          <div className="profile-user-header">


            <div className="profile-avatar">

              {profile.name

                ?.charAt(0)

                .toUpperCase()

                || "S"}

            </div>



            <div>


              {editMode ? (


                <input

                  type="text"

                  name="name"

                  className="profile-name-input"

                  value={profile.name}

                  onChange={handleChange}

                />


              ) : (


                <h2>

                  {profile.name || "Student"}

                </h2>


              )}


              <span className="student-badge">

                STUDENT

              </span>


              <p>

                {profile.department ||

                  "Department not updated"}

              </p>


            </div>


          </div>



          <div className="profile-divider"></div>



          {/* ACADEMIC INFORMATION */}

          <h2 className="section-title">

            🎓 Academic Information

          </h2>



          <div className="profile-grid">


            {/* FULL NAME */}

            <div className="profile-field">


              <label>

                Full Name

              </label>


              {editMode ? (


                <input

                  type="text"

                  name="name"

                  value={profile.name}

                  onChange={handleChange}

                />


              ) : (


                <div className="profile-value">

                  {profile.name || "Not updated"}

                </div>


              )}


            </div>



            {/* EMAIL */}

            <div className="profile-field">


              <label>

                Email

              </label>


              <div className="profile-value disabled-field">

                {profile.email || "Not updated"}

              </div>


            </div>



            {/* DEPARTMENT */}

            <div className="profile-field">


              <label>

                Department

              </label>


              {editMode ? (


                <input

                  type="text"

                  name="department"

                  value={profile.department}

                  onChange={handleChange}

                />


              ) : (


                <div className="profile-value">

                  {profile.department || "Not updated"}

                </div>


              )}


            </div>



            {/* PASSING YEAR */}

            <div className="profile-field">


              <label>

                Passing Year

              </label>


              {editMode ? (


                <input

                  type="number"

                  name="passingYear"

                  value={profile.passingYear}

                  onChange={handleChange}

                />


              ) : (


                <div className="profile-value">

                  {profile.passingYear || "Not updated"}

                </div>


              )}


            </div>



            {/* PHONE */}

            <div className="profile-field">


              <label>

                Phone

              </label>


              {editMode ? (


                <input

                  type="text"

                  name="phone"

                  value={profile.phone}

                  onChange={handleChange}

                  placeholder="Enter phone number"

                />


              ) : (


                <div className="profile-value">

                  {profile.phone || "Not updated"}

                </div>


              )}


            </div>



            {/* SKILLS */}

            <div className="profile-field">


              <label>

                Skills

              </label>


              {editMode ? (


                <input

                  type="text"

                  name="skills"

                  value={profile.skills}

                  onChange={handleChange}

                  placeholder="React, Python, Java..."

                />


              ) : (


                <div className="profile-value">

                  {profile.skills || "Not updated"}

                </div>


              )}


            </div>



            {/* CAREER INTEREST */}

            <div className="profile-field">


              <label>

                Career Interest

              </label>


              {editMode ? (


                <input

                  type="text"

                  name="careerInterest"

                  value={profile.careerInterest}

                  onChange={handleChange}

                  placeholder="Web Development, AI..."

                />


              ) : (


                <div className="profile-value">

                  {profile.careerInterest ||

                    "Not updated"}

                </div>


              )}


            </div>


          </div>



          {/* ABOUT ME */}

          <h2 className="section-title about-title">

            📝 About Me

          </h2>



          <div className="about-box">


            {editMode ? (


              <textarea

                name="about"

                value={profile.about}

                onChange={handleChange}

                placeholder="Tell something about yourself..."

                rows="5"

              />


            ) : (


              <p>

                {profile.about ||

                  "You have not added information about yourself yet."}

              </p>


            )}


          </div>


        </section>


      </main>


    </div>

  );

}


export default StudentProfile;