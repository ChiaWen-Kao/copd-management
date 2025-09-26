import React, { useContext } from "react";
import ClientContext from "../ClientContext";

import {
  BaseRenderer,
  RendererThemeProvider,
  useBuildForm,
  useRendererQueryClient,
  getResponse,
  useQuestionnaireResponseStore,
} from "@aehrc/smart-forms-renderer";
import { QueryClientProvider } from "@tanstack/react-query";
// import { Questionnaire } from 'fhir/r4';  // npm install --save @types/fhir
// import questionnaireData from "../components/data/copd_questionnaire_radiobtn.json";

import "../css/Questionnaire.css";
import customTheme from "../css/CustomTheme";

// To run MUI material, run: npm install @mui/material@5.16.7 @emotion/react @emotion/styled
// Don't install from website, smart form only supports older version v5.16.7
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

function COPDBaseRendererWrapper(props) {
  const { questionnaire } = props;
  const client = useContext(ClientContext);
  // set up the query client required by the form renderer
  const queryClient = useRendererQueryClient();

  // This hook builds the form based on the questionnaire
  const updatableResponse =
    useQuestionnaireResponseStore.use.updatableResponse();
  const isBuilding = useBuildForm(questionnaire);

  if (isBuilding) {
    return <div>Loading...</div>;
  }

  const isFormCompleted = () => {
    return questionnaire.item.every((question) => {
      const response = updatableResponse.item.find(
        (responseItem) => responseItem.linkId === question.linkId
      );
      return response && response.answer && response.answer.length > 0;
    });
  };

  // Function to be added for questionnaire submission
  const btnOnClick = async () => {
    if (!isFormCompleted()) {
      alert("Please complete the form before submitting.");
      return;
    }

    let questionnaireResponseToSave = JSON.parse(
      JSON.stringify(updatableResponse)
    );

    let score = 0;
    questionnaireResponseToSave.item.forEach((item) => {
      const answer = item.answer[0];
      if (answer.valueCoding) {
        score += parseInt(answer.valueCoding.code);
      }
    });

    questionnaireResponseToSave = {
      ...questionnaireResponseToSave,
      meta: {
        ...updatableResponse.meta,
        tag: [
          {
            system:
              "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression",
            code: `${score}`,
            display: "COPD Assessment Score",
          },
        ],
      },
      subject: {
        reference: `Patient/${client.patient.id}`,
        type: "Patient",
        display: client.patient.name,
      },
      authored: new Date().toISOString(),
      status: "completed",
    };

    const result = await client.request({
      url: "QuestionnaireResponse",
      method: "POST",
      body: JSON.stringify(questionnaireResponseToSave),
      headers: {
        "Content-Type": "application/fhir+json",
      }, // insert our own request headers here, optional
    });

    // const result = await client.create(updatableResponse)

    console.log("Submit button clicked: ", result);
    console.log("Calculated score: ", score);
    alert("Form submitted successfully. Score: " + score + "/32");
    window.location.reload();
  };

  const btnOnCancel = () => {
    console.log("Cancel button clicked");
  };

  const confirmSubmission = () => {
    const userConfirm = window.confirm("Are you sure you want to submit?");
    if (userConfirm) {
      btnOnClick();
    }
  };

  return (
    // The RendererThemeProvider provides the default renderer theme based on Material UI
    <RendererThemeProvider theme={customTheme}>
      <QueryClientProvider client={queryClient}>
        <div className="custom-theme">
          <BaseRenderer />
          <div className="btn-container">
            <Button
              className="submit-btn"
              variant="contained"
              color="primary"
              onClick={confirmSubmission}
              sx={{
                "&:hover": {
                  backgroundColor: customTheme.palette.primary.main,
                },
                backgroundColor: customTheme.palette.primary.main,
              }}
            >
              Submit
            </Button>
            <Button
              className="cancel-btn"
              variant="text"
              color="primary"
              onClick={btnOnCancel}
              sx={{ color: customTheme.palette.primary.main }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </QueryClientProvider>
    </RendererThemeProvider>
  );
}

// wrap the imported questionnaire in the component and render it
const COPDQuestionnaireRender = (props) => {
  const { questionnaireData } = props; // Destructure questionnaireData from props
  return <COPDBaseRendererWrapper questionnaire={questionnaireData} />;
};

export default COPDQuestionnaireRender;
