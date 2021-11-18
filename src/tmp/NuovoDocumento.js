import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory, useLocation } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";

import "./NuovoDocumento.css";

export default function NewNote() {
  const file = useRef(null);
  const history = useHistory();
  const [descrizione, setDescrizione] = useState("");
  const [isAnnulla, setAnnulla] = useState(false);

  const [isLoading] = useState(false);
  const { state } = useLocation();

  function validateForm() {
    return true;
    //TODO: verificare comportamento pulsante!

    /*
    if(file.current != null){
      console.log("---validateForm: " + file.current.name);
      return true;
    }else{
      console.log("---validateForm: VUOTO");
      return false;
    }
    */
    //return file.current != null;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
    validateForm();
  }


  async function handleSubmit(event) {
    event.preventDefault();

    console.log("#### " + isAnnulla);
    const idProgetto = state[0].projectId;
    const idCliente = state[0].clientId;

    if (isAnnulla){
      history.push({
        pathname: `/projects/${idProgetto}`,
        state: [{
          clientId: state[0].clientId
        }]
      });
    }else {


      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "idProgetto": idProgetto,
      "nome": file.current.name.split('.')[0],
      "dimensione": file.current.size,
      "estensione": file.current.name.split('.')[1],
      "descrizione": descrizione
    });


    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };


    fetch("http://localhost:8080/docs", requestOptions)
      .then(result => {
        if (result.status === 200) {
          history.push({
            pathname: `/projects/${idProgetto}`,
            state: [{
              clientId: state[0].clientId
            }]
          });
        } else {
          console.log('KO', result);
          //alert(result.statusText);
        }
      })
      .catch(error => {
        console.log('error', error);
        alert(error.message);
      });
    //setIsLoading(true);
    }

  }

  return (
    <div className="NuovoDocumento">
      <h4>Carica nuovo documento del progetto: {state[0].nomeProgetto}</h4>
      <br />
      <Form.Label>Descrizione del documento </Form.Label>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={descrizione}
            as="textarea"
            onChange={(e) => setDescrizione(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="secondary"
          isLoading={isLoading}
          disabled={!validateForm()}
          onClick={() => setAnnulla(true)}
        >
          Annulla
        </LoaderButton>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Carica
        </LoaderButton>
      </Form>
    </div>
  );
}
