import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory, useLocation } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import "./NuovoProgetto.css";

export default function NuovoCliente() {
  const history = useHistory();


  const [descrizione, setDescrizione] = useState("");
  const [nome, setNomeProgetto] = useState("");

  const [isLoading] = useState(false);
  const { state } = useLocation();

  const [isAnnulla, setAnnulla] = useState(false);
  function validateForm() {
    return nome.length > 0;
  }



  async function handleSubmit(event) {
    event.preventDefault();

    const idCliente = state[0].clientId;

    if (isAnnulla) {
      history.push("/customers/" + state[0].clientId);
    } else {

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "idCliente": idCliente,
        "nome": nome,
        "descrizione": descrizione
      });


      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      console.log(raw);

      fetch("http://localhost:8080/projects", requestOptions)
        .then(result => {
          if (result.status === 200) {

            history.push("/customers/" + state[0].clientId);
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


  }
  console.log(state);
  return (

    <div className="NuovoProgetto" >
       <h4>Crea nuovo progetto</h4><br />
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="nome">
          <Form.Label>Nome del progetto</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={nome}
            onChange={(e) => setNomeProgetto(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="descrizione">
          <Form.Label>Note</Form.Label>
          <Form.Control
            value={descrizione}
            as="textarea"
            onChange={(e) => setDescrizione(e.target.value)}
          />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="secondary"
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
          Crea Progetto
        </LoaderButton>

      </Form>
    </div>
  );
}
