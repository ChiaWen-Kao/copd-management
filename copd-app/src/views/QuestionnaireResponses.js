import React, {useEffect} from "react";
import {
  BaseRenderer,
  buildForm,
  RendererThemeProvider,
  useBuildForm,
  useRendererQueryClient,
} from "@aehrc/smart-forms-renderer";
import { QueryClientProvider } from "@tanstack/react-query";
import Accordion from "react-bootstrap/Accordion";
import "../css/QuestionnaireHistory.css";
import "../css/General.css";

// format date to dd-mm-yyyy hh:mm
function formatAuthoredDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear(); // Get year
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

// pre-filled QuestionnaireResponse resource
function QuestionnaireResponseRendererWrapper({
  questionnaire,
  questionnaireResponse,
}) {
  const queryClient = useRendererQueryClient();
  const isBuilding = useBuildForm(questionnaire, questionnaireResponse, true);

  // Disable radio buttons after rendering
  useEffect(() => {
    // Find and remove the "Clear" button
    const clearButtons = document.querySelectorAll(
      'button.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary'
    );
    clearButtons.forEach((button) => {
      if (button.textContent === "Clear") {
        button.remove();
      }
    });

  }, [isBuilding]);

  if (isBuilding) {
    return <div>Loading...</div>;
  }

  return (
    <RendererThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BaseRenderer />
      </QueryClientProvider>
    </RendererThemeProvider>
  );
}


// main component that renders the questionnaire responses
function QuestionnaireResponses({ questionnaireData, questionnaireResponses }) {
  useEffect(() => {
    if (questionnaireResponses.length > 0) {
      buildForm(questionnaireData, questionnaireResponses[0], true);
    }
  }, [questionnaireData, questionnaireResponses]);
  
  return (
    <div className="App">
      <h2 className="header-title">Questionnaire Responses</h2>
      {questionnaireResponses.length > 0 ? (
        <Accordion defaultActiveKey="0">
          {questionnaireResponses.map((qr, index) => (
            <Accordion.Item eventKey={index.toString()} key={qr.id} onClick={ () => buildForm(questionnaireData, questionnaireResponses[index], true) }>
              <Accordion.Header>
                <span
                  className={`accordion-icon ${
                    qr.isExpanded ? "expanded" : ""
                  }`}
                ></span>
                {qr.authored ? formatAuthoredDate(qr.authored) : "Unknown Date"}
              </Accordion.Header>
              <Accordion.Body>
                {/* render questionnaire response using SMART Forms renderer */}
                <QuestionnaireResponseRendererWrapper
                  questionnaire={questionnaireData}
                  questionnaireResponse={qr}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <div class="alert alert-warning d-flex align-items-center" role="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
            viewBox="0 0 16 16"
            role="img"
            aria-label="Warning:"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <div>
            You haven't completed a COPD assessment yet. Click the button to
            start your assessment.
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionnaireResponses;
