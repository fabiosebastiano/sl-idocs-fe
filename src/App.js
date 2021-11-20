import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";
import Routes from "./Routes";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./lib/contextLib";
import { useHistory } from "react-router-dom";

function App() {

  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [userId, userGetLoggedIn] = useState();
  const [customerId, setCustomerId] = useState();
  const [nomeUtente, setNomeUtente] = useState();
  const [cognomeUtente, setCognomeUtente] = useState();
  const history = useHistory();



  function handleLogout() {
    userHasAuthenticated(false);
    userGetLoggedIn();
    setCustomerId();
    setNomeUtente();
    setCognomeUtente();
    history.push("/login");
  }

  useEffect(() => {
    //console.log(">>>>> APP su LOCATION "+ location.pathname + " con autenticazione? "+ isAuthenticated);

  }, [isAuthenticated]);


  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
        <Navbar.Brand className="font-weight-bold text-muted">
          iDocs - Gestione Documentale in Cloud
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
            {
            isAuthenticated ? (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            ) : (
              <>
                <LinkContainer to="/signup">
                  <Nav.Link>Signup</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated, userId,  userGetLoggedIn, customerId, setCustomerId, nomeUtente, setNomeUtente, cognomeUtente, setCognomeUtente}}>
        <Routes />
      </AppContext.Provider>
    </div>
  );
  
}

export default App;
