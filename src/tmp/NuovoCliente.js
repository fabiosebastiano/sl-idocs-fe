import React, { useState } from "react";
import { useAppContext } from "../lib/contextLib";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import "./NuovoCliente.css";

export default function NuovoCliente() {
  const history = useHistory();

  const {  userId } = useAppContext();

  const [descrizione, setDescrizione] = useState("");
  const [ragioneSociale, setRagioneSociale] = useState("");
  const [partitaIva, setPartitaIva] = useState("");
  const [nazione, setNazione] = useState("");
  const [isAnnulla, setAnnulla] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return ragioneSociale.length > 0 && partitaIva.length > 0;
  }

  async function handleSubmit(event) {


    event.preventDefault();
    if (isAnnulla){
      history.push("/utente/"+userId);
    }else {


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "idUtente": userId,
      "ragioneSociale": ragioneSociale,
      "partitaIva": partitaIva,
      "nazione": nazione,
      "descrizione": descrizione
    });


    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };


    fetch("http://localhost:8080/customers", requestOptions)
      .then(result => {
        if (result.status === 200) {
          history.push("/utente/"+userId);
        } else {
          console.log('KO', result);
        }
      })
      .catch(error => {
        console.log('error', error);
        alert(error.message);
      });
      setIsLoading(false);

    }
  }

  return (
    <div className="NuovoCliente">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="ragioneSociale">
          <Form.Label>Ragione Sociale</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={ragioneSociale}
            onChange={(e) => setRagioneSociale(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="partitaIva">
          <Form.Label>Partita Iva</Form.Label>
          <Form.Control
            type="text"
            value={partitaIva}
            onChange={(e) => setPartitaIva(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="nazione">
          <Form.Label>Nazione</Form.Label>
          <Form.Control as="select" value={nazione} onChange={(e) => {
                console.log("e.target.value", e.target.value);
                setNazione(e.target.value);
            }
            }>
            <option value="Italia">Italia</option>
            <option value="Francia">Francia</option>
            <option value="Germania">Germania</option>
            </Form.Control>
        </Form.Group>
        <Form.Group controlId="descrizione">
            <Form.Label>Descrizione</Form.Label>
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
          Crea Cliente
        </LoaderButton>

      </Form>
    </div>
  );
}
