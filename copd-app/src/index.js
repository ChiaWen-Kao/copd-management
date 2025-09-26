import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom/client';
import { oauth2 as SMART } from "fhirclient";
import './index.css';
import App from './App';
import ClientContext from "./ClientContext";

// Access environment variables
const {
  REACT_APP_SCOPE,
  REACT_APP_CLIENT_ID
} = process.env;

// Create the root element for rendering the app
const root = ReactDOM.createRoot(document.getElementById('root'));

const Launch = () => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Initialize the SMART on FHIR client
    SMART.init({
      clientId: REACT_APP_CLIENT_ID,
      scope: REACT_APP_SCOPE
    })
      .then((client) => {
        setClient(client); // Set the client in the state
      })
      .catch((error) => {
        console.error("Error initializing FHIR client:", error);
      });
  }, []);

  if (!client) {
    return <div>Launching...</div>; // Show loading state while client is initializing
  }

  return (
    // Provide the FHIR client globally to the entire app
    <ClientContext.Provider value={client}>
      <App />
    </ClientContext.Provider>
  );
};

root.render(<Launch />);