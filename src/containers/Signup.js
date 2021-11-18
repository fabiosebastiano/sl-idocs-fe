import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Signup.css";
import { useAppContext } from "../lib/contextLib";
import { useHistory } from "react-router-dom";

export default function Signup() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { userHasAuthenticated } = useAppContext();
  const history = useHistory();

  function validateForm() {
    return username.length > 0 && password.length > 0;
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
          history.push("/home");
        } else {
          console.log('KO', result);
          //alert(result.statusText);
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
        </Form.Group>

        <Button block size="lg" type="submit" disabled={!validateForm()} variant="success">
          Crea Utente
        </Button>
      </Form>
    </div>
  );
}