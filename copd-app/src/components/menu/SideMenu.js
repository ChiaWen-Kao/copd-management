import React, { useState } from "react";
import "../../css/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import Logout from "../../views/Logout";

// "to="/questionnaire" to be changed to to a questionnaire component
const SideMenu = ({ name, setCurrentView, client }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleShowLogout = () => {
    setShowLogoutModal(true);
  };

  const handleCloseLogout = () => {
    setShowLogoutModal(false);
    setLoggingOut(false);
  };

  const handleLogout = () => {
    setLoggingOut(true);
    try {
      console.log("User logged out");
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        setShowLogoutModal(false);
        setLoggingOut(false);
        window.close();
      }, 2000);
    } catch (error) {
      console.log("Error logging out: ", error);
      alert("Error logging out. Please try again.");
      setLoggingOut(false);
    }
  };

  return (
    <>
      <Row>
        <Col xs={3} className="logo-container">
          <img
            className="logo"
            src="https://img.icons8.com/cotton/64/survey.png"
            alt="Logo"
          />
        </Col>
        <Col className="title align-middle">
          COPD
          <br />
          Self-Monitoring
        </Col>
      </Row>
      <Row>
        <Col className="subTitle">General</Col>
      </Row>
      <Row
        className="subMenu"
        onClick={() => setCurrentView("dashboard")}
        style={{ cursor: "pointer" }}
      >
        <Col xs={2} className="icon">
          <img
            className="menuIcon"
            src="https://img.icons8.com/fluency-systems-regular/50/home--v1.png"
            alt="Home"
          />
        </Col>
        <Col className="responsive-side-text">Home</Col>
      </Row>
      {/* <Row
        className="subMenu"
        onClick={() => setCurrentView("questionnaire")}
        style={{ cursor: "pointer" }}
      >
        <Col xs={2} className="icon">
          <img
            className="menuIcon"
            src="https://img.icons8.com/pastel-glyph/64/clipboard--v3.png"
            alt="COPD Assessment"
          />
        </Col>
        <Col>COPD Assessment</Col>
      </Row> */}
      <Row
        className="subMenu"
        onClick={() => setCurrentView("questionnaireResponses")}
        style={{ cursor: "pointer" }}
      >
        <Col xs={2} className="icon">
          <img
            className="menuIcon"
            src="https://img.icons8.com/pastel-glyph/64/clipboard--v3.png"
            alt="Assessment History"
          />
        </Col>
        <Col className="responsive-side-text">Questionnaire History</Col>
      </Row>
      <Row
        className="subMenu"
        onClick={() => setCurrentView("observations")}
        style={{ cursor: "pointer" }}
      >
        <Col xs={2} className="icon">
          <img
            className="menuIcon"
            src="https://img.icons8.com/parakeet-line/48/heart-monitor.png"
            alt="Device Record"
          />
        </Col>
        <Col className="responsive-side-text">Device Record</Col>
      </Row>
      <Row>
        <Col className="subTitle">Account</Col>
      </Row>
      <Row
        className="subMenu"
        onClick={() => setCurrentView("account")}
        style={{ cursor: "pointer" }}
      >
        <Col xs={2} className="icon">
          <img
            className="menuIcon"
            src="https://img.icons8.com/fluency-systems-regular/50/guest-male.png"
            alt="Account Setting"
          />
        </Col>
        <Col className="responsive-side-text">Account</Col>
      </Row>
      <Row
        className="subMenu"
        onClick={handleShowLogout}
        style={{ cursor: "pointer" }}
      >
        <Col xs={2} className="icon">
          <img
            className="menuIcon"
            src="https://img.icons8.com/fluency-systems-regular/50/exit--v1.png"
            alt="Logout"
          />
        </Col>
        <Col className="responsive-side-text">Logout</Col>
      </Row>
      <Row className="userProfile">
        {/* <hr /> */}
        <Col xs="auto">
          <img
            src="https://img.icons8.com/ios-filled/50/user-male-circle.png"
            alt="User Profile"
          />
        </Col>
        <Col>
          <Row className="role">Patient</Row>
          <Row className="patientName">{name}</Row>
        </Col>
      </Row>
      {/* Logout Modal */}
      <Logout
        show={showLogoutModal}
        handleClose={handleCloseLogout}
        handleLogout={handleLogout}
        loggingOut={loggingOut}
      />
    </>
  );
};

export default SideMenu;
