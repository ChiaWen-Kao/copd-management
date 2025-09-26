import React from "react";
import COPDQuestionnaireRenderer from "../views/COPDQuestionnaireRenderer";
import "../css/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Questionnaire = ({ questionnaireData }) => {
  return <COPDQuestionnaireRenderer questionnaireData={questionnaireData} />;
};

export default Questionnaire;
