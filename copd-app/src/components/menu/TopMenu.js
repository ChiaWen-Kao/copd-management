import React from "react";
import "../../css/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row } from "react-bootstrap";

const SideMenu = ({ name, setCurrentView }) => {
  return (
    <Row className="topMenu-container">
      <div className="topLeft-menu">
        <p>Welcome, {name} !</p>
      </div>
      <div className="topRight-menu">
        <button
          className="start-btn"
          onClick={() => setCurrentView("questionnaire")}
        >
          Start New Questionnaire
        </button>
      </div>
    </Row>
  );
};

export default SideMenu;
