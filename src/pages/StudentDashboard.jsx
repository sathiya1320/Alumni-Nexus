import React from "react";

import DashboardSidebar
  from "../components/DashboardSidebar";


function StudentDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  return (

    <div className="dashboard-layout">


      <DashboardSidebar />


      <main className="dashboard-content">


        <div className="welcome-section">

          <span>
            STUDENT PORTAL
          </span>


          <h1>

            Welcome back,

            <br />

            {user?.name || "Student"} 👋

          </h1>


          <p>

            Explore alumni,
            mentorship opportunities
            and career opportunities.

          </p>


        </div>


      </main>


    </div>

  );

}


export default StudentDashboard;