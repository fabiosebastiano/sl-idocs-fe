import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import { useAppContext } from "../lib/contextLib";
import { useHistory } from "react-router-dom";

export default function Login() {
    const [username, setUsernamel] = useState("");
    const [password, setPassword] = useState("");
    const { userHasAuthenticated, userGetLoggedIn, setNomeUtente, setCognomeUtente } = useAppContext();
    //const [useriId, setUserId] = useState();

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
                        console.log(data.nome);
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

                       // history.push("/utente/"+data.id);
                    });


                   // history.push("/home");
                } else {
                    console.log('KO', response);
                    alert(response.statusText);
                }
            })
            /*  .then(result => {
                  if (result.status === 200) {
                      console.log('OK', result.json());
                      userHasAuthenticated(true);
                      //setUserId(result.)
                      history.push("/home");
                  } else {
                      // console.log('KO', result);
                      alert(result.statusText);
                  }
              })*/
            .catch(error => {
                console.log('error', error);
                alert(error.message);
            });

        console.log("-------------");
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
        </div>
    );
}
