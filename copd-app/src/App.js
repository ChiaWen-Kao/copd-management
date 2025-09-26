import React, { useEffect, useState, useContext } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ClientContext from "./ClientContext";
import { Row, Col } from "react-bootstrap";
import Dashboard from "./views/Dashboard";
import Questionnaire from "./views/Questionnaire";
import Observations from "./views/Observations";
import QuestionnaireResponses from "./views/QuestionnaireResponses";
import Account from "./views/Account";
import SideMenu from "./components/menu/SideMenu";
import TopMenu from "./components/menu/TopMenu";

function App() {
  const client = useContext(ClientContext);
  console.log("FHIR client:", client);
  const [currentView, setCurrentView] = useState("dashboard"); // default view
  const [patient, setPatient] = useState(null);
  const [user, setUser] = useState(null);
  const [observations, setObservations] = useState([]);
  const [CATQuestionnaire, setCATQuestionnaire] = useState(null);
  const [questionnaireResponses, setQuestionnaireResponses] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Fetch the patient resource using the FHIR client
    client.patient
      .read()
      .then((patient) => setPatient(patient))
      .catch((authError) =>
        setErrors((prevErrors) => [...prevErrors, authError])
      );

    // Fetch the user resource using the FHIR client
    client.user
      .read()
      .then((user) => setUser(user))
      .catch((authError) =>
        setErrors((prevErrors) => [...prevErrors, authError])
      );

    // Fetch the Observation resources for the patient
    client
      .request(`Observation?patient=${client.patient.id}&_sort=-date`)
      .then((data) =>
        setObservations(data.entry?.map((entry) => entry.resource) || [])
      )
      .catch((fetchError) =>
        setErrors((prevErrors) => [...prevErrors, fetchError])
      );

    // Fetch the QuestionnaireResponse resources for the patient
    client
      .request(`QuestionnaireResponse?patient=${client.patient.id}`)
      .then((data) =>
        setQuestionnaireResponses(
          data.entry?.map((entry) => entry.resource) || []
        )
      )
      .catch((fetchError) =>
        setErrors((prevErrors) => [...prevErrors, fetchError])
      );

    // Fetch the Questionnaire resource for the COPD Assessment Test (CAT)
    client
      .request(`/Questionnaire/CAT?_format=json`)
      .then((data) => setCATQuestionnaire(data))
      .catch((fetchError) =>
        setErrors((prevErrors) => [...prevErrors, fetchError])
      );
  }, [client]);

  const name = patient
    ? patient.name[0]?.text ||
      `${patient.name[0]?.given.join(" ")} ${patient.name[0]?.family}`
    : user?.name[0]?.text ||
      `${user?.name[0]?.given.join(" ")} ${user?.name[0]?.family}`;

  if (!client || !patient || !user) {
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1>Loading...</h1>
          {errors.length > 0 && (
            <div>
              {errors.map((error, index) => (
                <div key={index}>{error.message}</div>
              ))}
            </div>
          )}
        </header>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            observations={observations}
            questionnaireResponses={questionnaireResponses}
            setCurrentView={setCurrentView}
            client={client}
          />
        );
      case "observations":
        return <Observations observations={observations} />;
      case "questionnaire":
        return <Questionnaire questionnaireData={CATQuestionnaire} />;
      case "questionnaireResponses":
        console.log("app: ", CATQuestionnaire);
        return (
          <QuestionnaireResponses
            questionnaireData={CATQuestionnaire}
            questionnaireResponses={questionnaireResponses}
          />
        );
      case "account":
        return <Account currentPatient={patient} />;
      default:
        return <Dashboard name={name} questionnaireData={CATQuestionnaire} />;
    }
  };

  return (
    <Row className="container">
      {/* side Menu */}
      <Col xs={2} className="sideMenu-container">
        <SideMenu name={name} setCurrentView={setCurrentView} client={client} />
      </Col>
      {/* main content */}
      <Col xs={10}>
        <TopMenu name={name} setCurrentView={setCurrentView} />
        <Row className="content-container">{renderView()}</Row>
      </Col>
    </Row>
  );
}

export default App;
