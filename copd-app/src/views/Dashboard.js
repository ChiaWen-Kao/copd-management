import React, { useState } from "react";
import "../css/Dashboard.css";
import "../css/Observation.css";
import "bootstrap/dist/css/bootstrap.min.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { Row, Col } from "react-bootstrap";

function formatAuthoredDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear(); // Get year
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function TriggerExample({ code, info, range }) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {code}: {info}
      <br />
      <b>{range}</b>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-info-circle"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
      </svg>
    </OverlayTrigger>
  );
}

const Dashboard = ({
  observations,
  questionnaireResponses,
  setCurrentView,
  client,
}) => {
  const [loading, setLoading] = useState(false);

  // Function to get the latest observation based on effectiveDateTime
  const getLatestObservation = (observations) => {
    return (
      observations.sort(
        (a, b) => new Date(b.effectiveDateTime) - new Date(a.effectiveDateTime)
      )[0] || {}
    );
  };

  const boxStyle = {
    border: "1px solid #dee2e6",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "1rem",
    flex: "1 1 calc(50% - 1rem)",
    marginRight: "1rem",
  };

  // Filter observations by LOINC codes
  const heartRateObservation = getLatestObservation(
    observations.filter((obs) =>
      obs.code?.coding?.some((coding) => coding.code === "8867-4")
    )
  );

  const dailyStepCountObservation = getLatestObservation(
    observations.filter((obs) =>
      obs.code?.coding?.some((coding) => coding.code === "41950-7")
    )
  );

  // const activityDurationObservation = getLatestObservation(
  //   observations.filter((obs) =>
  //     obs.code?.coding?.some((coding) => coding.code === "55411-3")
  //   )
  // );

  const bloodOxygenObservation = getLatestObservation(
    observations.filter((obs) =>
      obs.code?.coding?.some((coding) => coding.code === "59408-5")
    )
  );

  const getLatestCOPDAssessment = (questionnaireResponses) => {
    return (
      questionnaireResponses.sort(
        (a, b) => new Date(b.authored) - new Date(a.authored)
      )[0] || {}
    );
  };

  const latestCOPDAssessment = getLatestCOPDAssessment(questionnaireResponses);

  function getHealthImpactScore(score) {
    let impactLevel;
    let color;

    if (score === 0) {
      impactLevel = "Unknown";
      color = "grey";
    } else if (score >= 0 && score <= 8) {
      impactLevel = "Low";
      color = "green";
    } else if (score >= 9 && score <= 16) {
      impactLevel = "Medium";
      color = "#FFC107";
    } else if (score >= 17 && score <= 24) {
      impactLevel = "High";
      color = "orange";
    } else if (score >= 25 && score <= 32) {
      impactLevel = "Very High";
      color = "red";
    } else {
      impactLevel = "Unknown";
      color = "grey";
    }

    return { impactLevel, color };
  }

  const catCode = latestCOPDAssessment.meta?.tag?.[0]?.code;
  const { impactLevel, color } = getHealthImpactScore(
    catCode ? parseInt(catCode) : 0
  );

  // heart rate range
  function checkHeartRateRange(score) {
    var impactLevel;
    var color;

    if (score < 60) {
      impactLevel = "Low";
      color = "red";
    } else if (score > 100) {
      impactLevel = "High";
      color = "red";
    } else if (score >= 60 && score <= 100) {
      impactLevel = "Normal";
      color = "green";
    }

    return { impactLevel, color };
  }

  const heartRateValue = heartRateObservation.valueQuantity?.value || 0;
  const { impactLevel: heartRateLevel, color: heartRateColor } =
    checkHeartRateRange(heartRateValue);

  // daily step range
  function checkStepRange(score) {
    var impactLevel;
    var color;

    if (score < 6500) {
      impactLevel = "Low";
      color = "red";
    } else if (score > 10000) {
      impactLevel = "High";
      color = "red";
    } else if (score >= 6500 && score <= 10000) {
      impactLevel = "Normal";
      color = "green";
    }

    return { impactLevel, color };
  }

  const stepValue = dailyStepCountObservation.valueQuantity?.value || 0;
  const { impactLevel: stepLevel, color: stepColor } =
    checkStepRange(stepValue);

  // activity duration range
  // function checkActivityDurationRange(score) {
  //   var impactLevel;
  //   var color;

  //   if (score < 150) {
  //     impactLevel = "Low";
  //     color = "red";
  //   } else if (score >= 150) {
  //     impactLevel = "Normal";
  //     color = "green";
  //   }

  //   return { impactLevel, color };
  // }

  function checkbloodOxygenRange(score) {
    var impactLevel;
    var color;

    if (score < 95) {
      impactLevel = "Low";
      color = "red";
    } else if (score >= 95 && score <= 100) {
      impactLevel = "Normal";
      color = "green";
    }

    return { impactLevel, color };
  }

  const bloodOxygenValue = bloodOxygenObservation.valueQuantity?.value || 0;
  const { impactLevel: bloodOxygenLevel, color: bloodOxygenColor } =
    checkbloodOxygenRange(bloodOxygenValue);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/generate/${client.patient.id}`
      );
      const responseData = await response.json();
      const bundle = responseData.data;
      if (response.status === 200) {
        const importBundle = await client.request({
          url: "",
          method: "POST",
          body: JSON.stringify(bundle),
          headers: {
            "Content-Type": "application/fhir+json",
          },
        });
        console.log("Observations uploaded successfully: ", importBundle);
        alert("Observations uploaded successfully.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading observations: ", error);
      alert(
        "Error uploading observations. Please ensure localhost:8000 is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-wrap">
      {/* <div style={boxContainer}> */}
      <div className="box-container">
        <section>
          <h2 className="data-title">Latest Observations</h2>
          {/* Using boxStyle but didn't use inner-box-title here (fine with either one) */}
          <div style={boxStyle}>
            <Row>
              <Col>
                <h3 className="inner-title">Heart Rate</h3>
              </Col>
              <Col xs lg="1">
                <TriggerExample
                  code="8867-4"
                  info="Number of heartbeats per minute."
                  range="Normal range: 60-100 bpm"
                />
              </Col>
            </Row>
            {heartRateObservation.valueQuantity ? (
              <p>
                <strong className="inner-title">Date:</strong>{" "}
                {heartRateObservation.effectiveDateTime
                  ? new Date(
                      heartRateObservation.effectiveDateTime
                    ).toLocaleString()
                  : "Unknown"}{" "}
                -<strong className="inner-title"> Value:</strong>{" "}
                {heartRateObservation.valueQuantity.value}{" "}
                {heartRateObservation.valueQuantity.unit}
                <p className="inner-text">
                  <strong className="inner-title">Heart Rate Range:</strong>{" "}
                  <b style={{ color: heartRateColor }}>{heartRateLevel}</b>
                </p>
              </p>
            ) : (
              <p className="inner-text">No heart rate observations found.</p>
            )}
          </div>
        </section>

        <section>
          <div style={boxStyle}>
            <Row>
              <Col>
                <h3 className="inner-title">Daily Step Count</h3>
              </Col>
              <Col xs lg="1">
                <TriggerExample
                  code="41950-7"
                  info="Total steps taken in a day."
                  range="Daily steps: 10,000 steps"
                />
              </Col>
            </Row>
            {dailyStepCountObservation.valueQuantity ? (
              <p>
                <strong className="inner-title">Date:</strong>{" "}
                {dailyStepCountObservation.effectiveDateTime
                  ? new Date(
                      dailyStepCountObservation.effectiveDateTime
                    ).toLocaleString()
                  : "Unknown"}{" "}
                -<strong className="inner-title"> Value:</strong>{" "}
                {dailyStepCountObservation.valueQuantity.value} steps
                <p className="inner-text">
                  <strong className="inner-title">Daily Step Range:</strong>{" "}
                  <b style={{ color: stepColor }}>{stepLevel}</b>
                </p>
              </p>
            ) : (
              <p className="inner-text">
                No daily step count observations found.
              </p>
            )}
          </div>
        </section>
        {/* <section>
          <div style={boxStyle}>
            <Row>
              <Col>
                <h3 className="inner-title">Activity Duration</h3>
              </Col>
              <Col xs lg="1">
                <TriggerExample
                  code="55411-3"
                  info="Total time spent on physical activity."
                  range="Recommended: 150 min/week"
                />
              </Col>
            </Row>
            {activityDurationObservation.valueQuantity ? (
              <p>
                <strong>Date:</strong>{" "}
                {activityDurationObservation.effectiveDateTime
                  ? new Date(
                      activityDurationObservation.effectiveDateTime
                    ).toLocaleString()
                  : "Unknown"}{" "}
                -<strong> Value:</strong>{" "}
                {activityDurationObservation.valueQuantity.value} minutes
                <p className="inner-text">
                  <strong>Activity Duration Range:</strong>{" "}
                  <b style={{ color: activityDurationColor }}>{activityDurationLevel}</b>
                </p>
              </p>
            ) : (
              <p className="inner-text">
                No activity duration observations found.
              </p>
            )}
          </div>
        </section> */}
        <section>
          <div style={boxStyle}>
            <Row>
              <Col>
                <h3 className="inner-title">Blood Oxygen</h3>
              </Col>
              <Col xs lg="1">
                <TriggerExample
                  code="59408-5"
                  info="Percentage of oxygen in blood."
                  range="Normal range: 95%~100%"
                />
              </Col>
            </Row>
            {bloodOxygenObservation.valueQuantity ? (
              <p>
                <strong className="inner-title">Date:</strong>{" "}
                {bloodOxygenObservation.effectiveDateTime
                  ? new Date(
                      bloodOxygenObservation.effectiveDateTime
                    ).toLocaleString()
                  : "Unknown"}{" "}
                -<strong className="inner-title"> Value:</strong>{" "}
                {bloodOxygenObservation.valueQuantity.value}{" "}
                {bloodOxygenObservation.valueQuantity.unit}
                <p className="inner-text">
                  <strong className="inner-title">Blood Oxygen Range:</strong>{" "}
                  <b style={{ color: bloodOxygenColor }}>{bloodOxygenLevel}</b>
                </p>
              </p>
            ) : (
              <p className="inner-text">No blood oxygen observations found.</p>
            )}
          </div>
        </section>
      </div>

      <section className="box-container">
        <h2 className="data-title">Latest COPD Assessment</h2>
        {latestCOPDAssessment.id ? (
          <div style={boxStyle}>
            <p className="inner-text">
              <strong className="inner-title">Status:</strong>{" "}
              {latestCOPDAssessment.status}
            </p>
            <p className="inner-text">
              <strong className="inner-title">Completion Time:</strong>{" "}
              {formatAuthoredDate(latestCOPDAssessment.authored)}
            </p>
            <p className="inner-text">
              <strong className="inner-title">CAT Score:</strong>{" "}
              {latestCOPDAssessment.meta?.tag?.[0]?.code
                ? `${latestCOPDAssessment.meta.tag[0].code} points`
                : "N/A"}
            </p>
            <p className="inner-text">
              <strong className="inner-title">Health Impact:</strong>{" "}
              <b style={{ color: color }}>{impactLevel}</b>
            </p>
            <ul>
              {/* {latestCOPDAssessment.item?.map((item, index) => (
                <li key={index}>
                  <strong>{item.text}</strong>{" "}
                  {item.answer[0]?.valueString || "N/A"}
                </li>
              ))} */}
              {latestCOPDAssessment.item
                ?.filter(
                  (item) =>
                    item.answer[0]?.valueString === "Frequently" ||
                    item.answer[0]?.valueString === "All the time" ||
                    item.answer[0]?.valueString === "Not at all" ||
                    item.answer[0]?.valueString === "Very limited" ||
                    item.answer[0]?.valueString === "Quite limited" ||
                    item.answer[0]?.valueString === "Slightly"
                )
                .map((item, index) => (
                  <li key={index}>
                    <strong>{item.text}</strong>{" "}
                    {item.answer[0]?.valueString || "N/A"}
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <div style={boxStyle}>
            <p className="inner-text">
              No COPD questionnaire response found. Please submit a new
              questionnaire.
            </p>
          </div>
        )}
      </section>
      <Button
        variant="outline-secondary"
        className="obs-button"
        onClick={handleButtonClick}
        disabled={loading}
      >
        {loading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}{" "}
        Upload Observations
      </Button>
    </div>
  );
};

export default Dashboard;
