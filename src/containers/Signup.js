import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Signup.css";
import { useAppContext } from "../lib/contextLib";
import { useHistory } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { BiErrorCircle } from "react-icons/bi";


export default function Signup() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();
  const { userHasAuthenticated, userGetLoggedIn, setNomeUtente, setCognomeUtente } = useAppContext();

  const [showOk, setShowOk] = useState(false);
  const [showError, setShowError] =  useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0 && confirmPassword.length > 0 && password === confirmPassword && email.length > 0 && nome.length > 0 && cognome.length > 0;
   // return username.length > 0 && email.length > 0 && password > 0 && password === confirmPassword
  }

  function handleSubmit(event) {
    event.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "username": username,
      "password": password,
      "nome": nome,
      "cognome": cognome,
      "mail": email
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/users", requestOptions)
      .then(result => {
        if (result.status === 200) {
           userHasAuthenticated(true);
           result.json().then(data => {
                
                userGetLoggedIn(data.id);
                userHasAuthenticated(true);
                setNomeUtente(data.nome);
                setCognomeUtente(data.cognome);
                
                history.push({
                  pathname: `/utente/${data.id}`,
                  state: [{
                    userId: data.id,
                    nomeUtente: data.nome,
                    cognomeUtente: data.cognome
                  }]
                });
                
           
           });
        } else {
          
          setErrorMessage("ERRORE REGISTRAZIONE NUOVO UTENTE");
          setShowError(true);
        }
      })
      .catch(error => {
        console.log('error', error);
        alert(error.message);
      });

  }

  return (
    <div className="Signup">
      <h1>Registrazione nuovo utente</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="nome">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="cognome">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </Form.Group>
        <Form.Group size="lg" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label>Conferma Password</Form.Label> 
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
        </Form.Group>

        </Form.Group>

        <Button block size="lg" type="submit" disabled={!validateForm()} variant="success">
          Crea Utente
        </Button>
      </Form> 
      <Modal show={showOk} onHide={() => setShowOk(false)} animation={false}>
        <Modal.Header closeButton>
            <Modal.Title>Registrazione avvenuta con successo</Modal.Title>
        </Modal.Header>
        <Modal.Body >
            <div align="center">
            Registrazione avvenuta con successo
        </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowError(false)}>
            Chiudi
            </Button>
        </Modal.Footer>
      </Modal> 

      <Modal show={showError} onHide={() => setShowError(false)} animation={false}>
        <Modal.Header closeButton>
            <Modal.Title><BiErrorCircle /> Attenzione</Modal.Title>
        </Modal.Header>
        <Modal.Body >
            <div align="center">
            {errorMessage}
        </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowError(false)}>
            Chiudi
            </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}