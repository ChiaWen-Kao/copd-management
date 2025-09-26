// Example observations measures we can use:
// https://build.fhir.org/ig/HL7/physical-activity/measures.html
import React from "react";
import "../css/Observation.css";

function Observations({ observations }) {
  // Filter observations by LOINC codes
  const heartRateObservations = observations.filter((obs) =>
    obs.code?.coding?.some((coding) => coding.code === "8867-4")
  );
  const dailyStepCountObservations = observations.filter((obs) =>
    obs.code?.coding?.some((coding) => coding.code === "41950-7")
  );
  // const activityDurationObservations = observations.filter((obs) =>
  //   obs.code?.coding?.some((coding) => coding.code === "55411-3")
  // );
  const bloodOxygenObservations = observations.filter((obs) =>
    obs.code?.coding?.some((coding) => coding.code === "59408-5")
  );

  return (
    <div className="App data-wrap">
      <div className="obs-container">
        <h2 className="data-title">Device Observation Data History</h2>
        <section className="inner-title-box">
          <h3 className="obs-title">Heart Rate (8867-4):</h3>
          {heartRateObservations.length > 0 ? (
            <ul>
              {heartRateObservations
                .sort(
                  (a, b) =>
                    new Date(b.effectiveDateTime) -
                    new Date(a.effectiveDateTime)
                )
                .map((obs, index) => (
                  <li key={index} className="li-align-left">
                    <strong>Date:</strong>{" "}
                    {obs.effectiveDateTime
                      ? new Date(obs.effectiveDateTime).toLocaleString()
                      : "Unknown"}{" "}
                    -<strong> Value:</strong> {obs.valueQuantity?.value}{" "}
                    {obs.valueQuantity?.unit}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="obs-text">No heart rate observations found.</p>
          )}
        </section>
        <section className="inner-title-box">
          <h3 className="obs-title">Daily Step Count (41950-7):</h3>
          {dailyStepCountObservations.length > 0 ? (
            <ul>
              {dailyStepCountObservations
                .sort(
                  (a, b) =>
                    new Date(b.effectiveDateTime) -
                    new Date(a.effectiveDateTime)
                )
                .map((obs, index) => (
                  <li key={index} className="li-align-left">
                    <strong>Date:</strong>{" "}
                    {obs.effectiveDateTime
                      ? new Date(obs.effectiveDateTime).toLocaleString()
                      : "Unknown"}{" "}
                    -<strong> Value:</strong> {obs.valueQuantity?.value} steps
                  </li>
                ))}
            </ul>
          ) : (
            <p className="obs-text">No daily step count observations found.</p>
          )}
        </section>
        {/* <section className="inner-title-box">
          <h3 className="obs-title">Activity Duration (55411-3):</h3>
          {activityDurationObservations.length > 0 ? (
            <ul>
              {activityDurationObservations.map((obs, index) => (
                <li key={index}>
                  <strong>Date:</strong>{" "}
                  {obs.effectiveDateTime
                    ? new Date(obs.effectiveDateTime).toLocaleString()
                    : "Unknown"}{" "}
                  -<strong> Value:</strong> {obs.valueQuantity?.value} minutes
                </li>
              ))}
            </ul>
          ) : (
            <p className="obs-text">No activity duration observations found.</p>
          )}
        </section> */}
        <section className="inner-title-box">
          <h3 className="obs-title">Blood Oxygen (59408-5):</h3>
          {bloodOxygenObservations.length > 0 ? (
            <ul>
              {bloodOxygenObservations
                .sort(
                  (a, b) =>
                    new Date(b.effectiveDateTime) -
                    new Date(a.effectiveDateTime)
                )
                .map((obs, index) => (
                  <li key={index} className="li-align-left">
                    <strong>Date:</strong>{" "}
                    {obs.effectiveDateTime
                      ? new Date(obs.effectiveDateTime).toLocaleString()
                      : "Unknown"}{" "}
                    -<strong> Value:</strong> {obs.valueQuantity?.value}{" "}
                    {obs.valueQuantity?.unit}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="obs-text">No blood oxygen observations found.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Observations;
