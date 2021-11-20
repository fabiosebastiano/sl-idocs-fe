import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../lib/contextLib";
import { useHistory } from "react-router-dom";
import { Button, Modal} from "react-bootstrap";
import "./Login.css";

export default function Login() {
    const history = useHistory();
    const [username, setUsernamel] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError]                 = useState(false);

    const { userHasAuthenticated, userGetLoggedIn, setNomeUtente, setCognomeUtente } = useAppContext();
    

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": username,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/users/login", requestOptions)
            .then(response => {
                if (response.status === 200) {

                    response.json().then(data => {
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
                    //console.log('KO', response);
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
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={username}
                        onChange={(e) => setUsernamel(e.target.value)}
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
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    disabled={!validateForm()}
                >
                    Login
                </LoaderButton>
            </Form>
            <Modal show={showError} onHide={() => setShowError(false)} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title> Attenzione</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <div align="center">
                    Username o password errata.
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
