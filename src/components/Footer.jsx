import React from "react";
import {
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhone,
  FaFax,
  FaEnvelope,
  FaHome,
  FaInfoCircle,
  FaCalendarAlt,
  FaBriefcase,
  FaUser,
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      {/* ================= FOOTER MAIN ================= */}
      <div className="footer-main">

        {/* ================= ABOUT ================= */}
        <div className="footer-column footer-about">

          <div className="footer-logo">
            <FaGraduationCap />
            <span>Alumni Nexus</span>
          </div>

          <p className="footer-description">
            Connecting alumni, students and institutions together
            for networking, mentorship, career guidance and
            event engagement.
          </p>

        </div>


        {/* ================= COLLEGE CONTACT ================= */}
        <div className="footer-column footer-contact">

          <h3>College Contact</h3>

          <div className="footer-contact-item">
            <FaMapMarkerAlt className="footer-contact-icon" />

            <div>
              <h4>
                The Standard Fireworks Rajaratnam
                College For Women
              </h4>

              <p>
                Thiruthangal Road,<br />
                Sivakasi - 626123,<br />
                Tamil Nadu, India
              </p>
            </div>
          </div>


          <div className="footer-contact-item">
            <FaPhone className="footer-contact-icon" />

            <div>
              <h4>Telephone</h4>
              <p>+91 4562-220389</p>
            </div>
          </div>


          <div className="footer-contact-item">
            <FaFax className="footer-contact-icon" />

            <div>
              <h4>Fax</h4>
              <p>+91 4562-226695</p>
            </div>
          </div>


          <div className="footer-contact-item">
            <FaEnvelope className="footer-contact-icon" />

            <div>
              <h4>Email</h4>

              <a href="mailto:sfrc@sfrcollege.edu.in">
                sfrc@sfrcollege.edu.in
              </a>
            </div>
          </div>

        </div>


        {/* ================= QUICK LINKS ================= */}
        <div className="footer-column footer-links">

          <h3>Quick Links</h3>

          <a href="/">
            <FaHome />
            Home
          </a>

          <a href="/#about">
            <FaInfoCircle />
            About
          </a>

          <a href="/#events">
            <FaCalendarAlt />
            Events
          </a>

          <a href="/jobs">
            <FaBriefcase />
            Jobs
          </a>

          <a href="/profile">
            <FaUser />
            Profile
          </a>

        </div>

      </div>


      {/* ================= FOOTER BOTTOM ================= */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Alumni Nexus.
          All Rights Reserved.
        </p>

        <p>
          Developed for
          <span> The Standard Fireworks Rajaratnam College For Women</span>
        </p>

      </div>

    </footer>
  );
}

export default Footer;