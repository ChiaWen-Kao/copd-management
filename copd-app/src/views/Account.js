import React from "react";
import "../css/General.css";

const Account = ({ currentPatient }) => {
  const name = currentPatient
    ? currentPatient.name[0]?.text ||
      `${currentPatient.name[0]?.given.join(" ")} ${
        currentPatient.name[0]?.family
      }`
    : "No patient data available";

  return (
    <div className="account-info">
      <div className="body">
        <h5 className="header-title">Patient Information</h5>
        <div className="content-wrap">
          <p className="text">
            <strong>Name:</strong>&nbsp;{name}
          </p>
          <p className="text">
            <strong>Gender:</strong>&nbsp;{currentPatient?.gender || "N/A"}
          </p>
          <p className="text">
            <strong>Birthdate:</strong>&nbsp;
            {currentPatient?.birthDate || "N/A"}
          </p>
          {/* Add more patient details as needed */}
        </div>
      </div>
    </div>
  );
};

export default Account;
