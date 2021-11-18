import React, { useState } from "react";
import { useAppContext } from "../lib/contextLib";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import "./AssociaCliente.css";

export default function AssociaCliente() {
  const history = useHistory();

  const {  userId } = useAppContext();

  const [descrizione, setDescrizione] = useState("");
  const [ragioneSociale, setRagioneSociale] = useState("");
  const [partitaIva, setPartitaIva] = useState("");
  const [nazione, setNazione] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return ragioneSociale.length > 0 && partitaIva.length > 0;
  }



  function handleSubmit(event) {

    console.log(">>>>> ASSOCIA CLIENTE ESISTENTE ALL'UTENTE: ", userId);
    console.log(event);

    event.preventDefault();
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

    console.log(raw);

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

    setIsLoading(true);
  }

  function handleReset(event) {

    history.push("/utente/"+userId);
  }



  return (
    <div className="AssociaCliente" >
      <Form onSubmit={handleSubmit} onReset={handleReset} >

        <Form.Group size="lg" controlId="nazione">
          <Form.Label>Clienti non ancora associati</Form.Label>
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

        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          disabled={false}
        >
          Associa Cliente
        </LoaderButton>
        <LoaderButton
          block
          type="reset" value="Annulla"
          size="lg"
          variant="primary"
          disabled={false}
        >
          Annulla
        </LoaderButton>
      </Form>
    </div>
  );
}
