import React from "react";
import "./About.css";
import Navbar from "../components/Navbar";
import { FaBullseye, FaEye, FaUsers, FaChartLine, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const About = () => {
  return (
    <div className="about-page">
      

      {/* Header Section */}
      <header className="about-header">
        <h1>About Local-Global-Shops</h1>
        <p>
          Local-Global-Shops is an AI-driven smart shopping platform that bridges the gap between local and global
          stores. We empower users to shop faster, negotiate prices, and enjoy a seamless buying experience — all in one place.
        </p>
      </header>

      {/* Story Section */}
      <section className="story-section container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img
              src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Our Story"
            />
          </div>
          <div className="col-lg-6">
            <h2>Our Story</h2>
            <p className="lead">
              Founded by a passionate team of innovators from NEC Narasaraopet, Local-Global-Shops was built to
              revolutionize how people buy from local stores while still having access to global e-commerce giants.
            </p>
            <p>
              The project started as a college innovation, led by <strong>Ayyappa Rayudu (Abhi)</strong>, who envisioned
              combining the convenience of online shopping with the trust of local stores.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section py-5">
        <div className="container text-center">
          <h2 className="mb-5">Our Mission & Vision</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="mission-card">
                <FaBullseye className="icon" />
                <h3>Our Mission</h3>
                <p>
                  To create a unified shopping experience where users can compare, negotiate, and purchase products
                  from both local and international vendors — saving time, money, and effort.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mission-card">
                <FaEye className="icon" />
                <h3>Our Vision</h3>
                <p>
                  To become the world’s most trusted hybrid shopping platform, empowering small businesses and
                  connecting communities globally through smart technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 text-center">
        <div className="container">
          <h2 className="mb-4">Our Impact</h2>
          <div className="row g-4">
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <h3>1K+</h3>
                <p>Active Users</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <h3>300+</h3>
                <p>Local Shops Connected</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <h3>150+</h3>
                <p>Products Available</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <h3>98%</h3>
                <p>User Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section py-5">
        <div className="container text-center">
          <h2 className="mb-5">Meet Our Team</h2>
          <div className="row g-4 justify-content-center">

            {/* Ayyappa Rayudu */}
            <div className="col-md-4 col-lg-3">
              <div className="team-card">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Team Member"
                  className="team-image"
                />
                <h4 className="team-name">Ayyappa Rayudu (Abhi)</h4>
                <p className="team-role">Team Lead & Full-Stack Developer</p>
                <div className="team-socials">
                  <a href="#"><FaFacebook /></a>
                  <a href="#"><FaTwitter /></a>
                  <a href="#"><FaLinkedin /></a>
                </div>
              </div>
            </div>

           

            {/* Yaka Mohan Kumar */}
            <div className="col-md-4 col-lg-3">
              <div className="team-card">
                <img
                  src="https://randomuser.me/api/portraits/men/77.jpg"
                  alt="Team Member"
                  className="team-image"
                />
                <h4 className="team-name">Yaka Mohan Kumar</h4>
                <p className="team-role">Backend Developer</p>
                <div className="team-socials">
                  <a href="#"><FaFacebook /></a>
                  <a href="#"><FaTwitter /></a>
                  <a href="#"><FaLinkedin /></a>
                </div>
              </div>
            </div>

            {/* Rongali Siva Kumar */}
            <div className="col-md-4 col-lg-3">
              <div className="team-card">
                <img
                  src="https://randomuser.me/api/portraits/men/68.jpg"
                  alt="Team Member"
                  className="team-image"
                />
                <h4 className="team-name">Rongali Siva Kumar</h4>
                <p className="team-role">Frontend Developer</p>
                <div className="team-socials">
                  <a href="#"><FaFacebook /></a>
                  <a href="#"><FaTwitter /></a>
                  <a href="#"><FaLinkedin /></a>
                </div>
              </div>
            </div>

            {/* Rongala Krishnam Raju Swamy */}
            <div className="col-md-4 col-lg-3">
              <div className="team-card">
                <img
                  src="https://randomuser.me/api/portraits/men/70.jpg"
                  alt="Team Member"
                  className="team-image"
                />
                <h4 className="team-name">Rongala Krishnam Raju Swamy</h4>
                <p className="team-role">UI/UX Designer</p>
                <div className="team-socials">
                  <a href="#"><FaFacebook /></a>
                  <a href="#"><FaTwitter /></a>
                  <a href="#"><FaLinkedin /></a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
