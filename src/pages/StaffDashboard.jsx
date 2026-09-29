import React, {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import API from "../services/api";

import "./StaffDashboard.css";


function StaffDashboard() {


  const navigate =
    useNavigate();


  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};


  const [dashboard, setDashboard] =
    useState({

      totalUsers: 0,

      totalStudents: 0,

      totalAlumni: 0,

      totalStaff: 0,

      totalEvents: 0,

      totalJobs: 0,

      totalMentorshipRequests: 0,

      pendingMentorshipRequests: 0

    });


  const [loading, setLoading] =
    useState(true);



  useEffect(() => {


    const fetchDashboard =
      async () => {


        try {


          const response =
            await API.get(
              "/dashboard/staff"
            );


          setDashboard(
            response.data
          );


        } catch (error) {


          console.error(
            "STAFF DASHBOARD ERROR:",
            error
          );


        } finally {


          setLoading(false);


        }


      };


    fetchDashboard();


  }, []);



  const handleLogout = () => {


    localStorage.removeItem("token");

    localStorage.removeItem("user");


    navigate("/login");


  };



  if (loading) {


    return (

      <div className="dashboard-loading">

        Loading dashboard...

      </div>

    );


  }



  return (


    <div className="staff-dashboard">


      <aside className="staff-sidebar">


        <div className="staff-logo">

          🎓 Alumni Nexus

        </div>


        <div className="staff-label">

          STAFF PORTAL

        </div>



        <nav>


          <Link
            to="/staff-dashboard"
            className="active"
          >

            🏠 Dashboard

          </Link>
          <Link 
            to="/staff/alumni-management">
            👩‍🎓 Alumni Management
          </Link>


          <Link to="/alumni">

            👥 Alumni Records

          </Link>


         
         <Link to="/staff-events">
             📅 Event Management
         </Link>


          <Link to="/jobs">

            💼 Jobs

          </Link>


          <Link to="/notifications">

            🔔 Notifications

          </Link>


        </nav>



        <button
          className="staff-logout"
          onClick={handleLogout}
        >

          🚪 Logout

        </button>


      </aside>



      <main className="staff-main">


        <section className="staff-hero">


          <div>


            <span>

              STAFF PORTAL

            </span>


            <h1>

              Welcome,

              <br />

              {user.name || "Staff"} 👋

            </h1>


            <p>

              Manage the Alumni Nexus platform
              from one central dashboard.

            </p>


          </div>


          <div className="staff-icon">

            🏢

          </div>


        </section>



        <h2 className="staff-title">

          Platform Statistics

        </h2>



        <div className="staff-grid">


          <div className="staff-card">

            <div>👥</div>

            <h2>
              {dashboard.totalUsers}
            </h2>

            <p>
              Total Users
            </p>

          </div>



          <div className="staff-card">

            <div>🎓</div>

            <h2>
              {dashboard.totalStudents}
            </h2>

            <p>
              Students
            </p>

          </div>



          <div className="staff-card">

            <div>💼</div>

            <h2>
              {dashboard.totalAlumni}
            </h2>

            <p>
              Alumni
            </p>

          </div>



          <div className="staff-card">

            <div>📅</div>

            <h2>
              {dashboard.totalEvents}
            </h2>

            <p>
              Events
            </p>

          </div>



          <div className="staff-card">

            <div>💼</div>

            <h2>
              {dashboard.totalJobs}
            </h2>

            <p>
              Jobs
            </p>

          </div>



          <div className="staff-card">

            <div>🤝</div>

            <h2>
              {dashboard.totalMentorshipRequests}
            </h2>

            <p>
              Mentorship Requests
            </p>

          </div>


        </div>



      </main>


    </div>


  );


}


export default StaffDashboard;