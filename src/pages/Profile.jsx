import {
  useEffect,
  useState,
} from "react";

import "../styles/Profile.css";

import API from "../services/api";

function Profile() {

  const [profile, setProfile] =
    useState({

      name: "",
      email: "",
      role: "",
      department: "",
      passingYear: "",
      designation: "",
      company: "",
      location: "",
      skills: "",
      phone: "",
      bio: "",

    });


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // =====================================================
  // LOAD LOGGED-IN USER PROFILE
  // =====================================================

  useEffect(() => {

    const loadProfile =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {

            alert(
              "Please login first!"
            );

            return;

          }


          const response =
            await API.get(
              "/profile",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          const user =
            response.data.user;


          setProfile({

            name:
              user.name || "",

            email:
              user.email || "",

            role:
              user.role || "",

            department:
              user.department || "",

            passingYear:
              user.passingYear || "",

            designation:
              user.designation || "",

            company:
              user.company || "",

            location:
              user.location || "",

            skills:
              user.skills || "",

            phone:
              user.phone || "",

            bio:
              user.bio || "",

          });


        } catch (error) {

          console.error(
            "PROFILE LOAD ERROR:",
            error
          );


          alert(
            error.response?.data?.message ||
            "Unable to load profile"
          );

        } finally {

          setLoading(false);

        }
      };


    loadProfile();

  }, []);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange =
    (e) => {

      setProfile({

        ...profile,

        [e.target.name]:
          e.target.value,

      });

    };


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setSaving(true);


      try {

        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          alert(
            "Please login first!"
          );

          return;

        }


        const response =
          await API.put(

            "/profile",

            {

              name:
                profile.name,

              department:
                profile.department,

              passingYear:
                profile.passingYear,

              designation:
                profile.designation,

              company:
                profile.company,

              location:
                profile.location,

              skills:
                profile.skills,

              phone:
                profile.phone,

              bio:
                profile.bio,

            },

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        // Update local user also

        const oldUser =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          ) || {};


        const updatedUser = {

          ...oldUser,

          name:
            response.data.user.name,

          email:
            response.data.user.email,

          role:
            response.data.user.role,

          department:
            response.data.user.department,

          passingYear:
            response.data.user.passingYear,

        };


        localStorage.setItem(

          "user",

          JSON.stringify(
            updatedUser
          )

        );


        alert(
          "Profile saved successfully! ✅"
        );


      } catch (error) {

        console.error(
          "PROFILE SAVE ERROR:",
          error
        );


        alert(
          error.response?.data?.message ||
          "Unable to connect to backend"
        );

      } finally {

        setSaving(false);

      }

    };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="profile-page">

        <div className="profile-card">

          <h2>
            Loading Profile...
          </h2>

        </div>

      </div>

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="profile-page">

      <div className="profile-card">

        <h1>
          Edit Profile
        </h1>


        <p className="profile-role">

          Logged in as:

          <strong>
            {" "}
            {profile.role}
          </strong>

        </p>


        <form
          onSubmit={handleSubmit}
          className="profile-form"
        >

          {/* NAME */}

          <div className="form-group">

            <label>
              Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={profile.email}
              disabled
            />

          </div>


          {/* DEPARTMENT */}

          <div className="form-group">

            <label>
              Department
            </label>

            <input
              type="text"
              name="department"
              placeholder="Enter department"
              value={profile.department}
              onChange={handleChange}
            />

          </div>


          {/* PASSING YEAR */}

          <div className="form-group">

            <label>
              Passing Year
            </label>

            <input
              type="text"
              name="passingYear"
              placeholder="Enter passing year"
              value={profile.passingYear}
              onChange={handleChange}
            />

          </div>


          {/* DESIGNATION */}

          <div className="form-group">

            <label>
              Designation
            </label>

            <input
              type="text"
              name="designation"
              placeholder="Enter designation"
              value={profile.designation}
              onChange={handleChange}
            />

          </div>


          {/* COMPANY */}

          <div className="form-group">

            <label>
              Company
            </label>

            <input
              type="text"
              name="company"
              placeholder="Enter company name"
              value={profile.company}
              onChange={handleChange}
            />

          </div>


          {/* LOCATION */}

          <div className="form-group">

            <label>
              Location
            </label>

            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={profile.location}
              onChange={handleChange}
            />

          </div>


          {/* SKILLS */}

          <div className="form-group">

            <label>
              Skills
            </label>

            <input
              type="text"
              name="skills"
              placeholder="React, Node.js, MongoDB"
              value={profile.skills}
              onChange={handleChange}
            />

          </div>


          {/* PHONE */}

          <div className="form-group">

            <label>
              Phone
            </label>

            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={profile.phone}
              onChange={handleChange}
            />

          </div>


          {/* BIO */}

          <div className="form-group">

            <label>
              Bio
            </label>

            <textarea
              name="bio"
              placeholder="Tell something about yourself"
              value={profile.bio}
              onChange={handleChange}
            />

          </div>


          {/* SAVE */}

          <button
            className="save-btn"
            type="submit"
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Save Profile"}

          </button>

        </form>

      </div>

    </div>

  );
}

export default Profile;