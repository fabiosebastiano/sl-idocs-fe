import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { RiDeleteBin6Line } from "react-icons/ri";

import { RiTodoFill } from "react-icons/ri";
import { GoProject } from "react-icons/go";
import { AiOutlineLink, AiOutlineEdit, AiOutlineReload } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from 'react-select'

import "./Home.css";
export default function Utente() {
  const history = useHistory();
  const [customers, setCustomers] = useState([]);
  const { isAuthenticated, userId, setCustomerId, nomeUtente, cognomeUtente } = useAppContext();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);


  const [showDelete, setShowDelete] = useState(false);
  const [showAssociaAdAltroUtente, setShowAssociaAdAltroUtente] = useState(false);
  const [showAssociaAdAltroCliente, setShowAssociaAdCliente] = useState(false);
  const [showModificaCliente, setShowModificaCliente] = useState(false);
  const [showAssociaConfirmaButton, setShowAssociaConfirmaButton] = useState(false);
  
  const [clienteSeleazionato, setClienteSelezionato] = useState(null);
  const [ragioneSocialeClienteSelezionato, setRagioneSociale] = useState("");
  const [idClienteDaAssociare, setIdClienteDaAssociare] = useState(null);
  const [idUtenteDaAssociare, setIdUtenteDaAssociare] = useState(null);
  
  const [utenti, setUtenti] = useState([]);
  const [clientiNonAssociati, setClientiNonAssociati] = useState([]);

  const renderProjectTooltip = props => (
    <Tooltip {...props}>Vai ai progetti del cliente</Tooltip>
  );
  const renderAssociaTooltip = props => (
    <Tooltip {...props}>Associa altro utente al cliente</Tooltip>
  );
  const renderEliminaTooltip = props => (
    <Tooltip {...props}>Elimina cliente</Tooltip>
  );
  const renderEditTooltip = props => (
    <Tooltip {...props}>Modifica cliente</Tooltip>
  );

  //ELENCO COLONNE TABELLA PRINCIPALE
  const columns = [
    { id: 'ragioneSociale', label: 'RAGIONE SOCIALE', align: 'left', sortable: true, disableClickEventBubbling: true },
    { id: 'partitaIva', label: 'PARTITA IVA', align: 'center', type: 'number', disableClickEventBubbling: true },
    { id: 'Nazione', label: 'NAZIONE', align: 'center', disableClickEventBubbling: true },
    { id: 'Descrizione', label: 'NOTE', align: 'center', disableClickEventBubbling: true },
    { id: 'edit', label: '', align: 'left', disableClickEventBubbling: true }
  ];


  function confermaModificaCliente() {

  }
  function editCliente(id, ragioneSociale) {
    setClienteSelezionato(id);
    setRagioneSociale(ragioneSociale);
   
    setShowModificaCliente(true);
  }

  function eliminaCliente(id, ragioneSociale) {
    setClienteSelezionato(id);
    setRagioneSociale(ragioneSociale);
    setShowDelete(true);
  }

  function associaCliente(id, ragioneSociale) {
    setClienteSelezionato(id);
    setIdClienteDaAssociare(id);
    setRagioneSociale(ragioneSociale);
    loadUtenti();
   
    setShowAssociaAdAltroUtente(true);
  }
  function associaUtente() {

    loadClienti();
    setShowAssociaAdCliente(true);
  }

  async function loadClienti() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };


    fetch("http://localhost:8080/customers/not/" + id, requestOptions)
      .then(result => {
        if (result.status === 200) {

          result.json().then(data => {

            const options = data.map(d => ({
              "value": d.id,
              "label": d.ragioneSociale
            }));

            setClientiNonAssociati(options);


          })
        } else {
          console.log('KO', result);
        }
      })
      .catch(error => {
        console.log('error', error);
        alert(error.message);
      });
  }

  function confermaAssociazione() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "idClienteDaAggiungere": idClienteDaAssociare,
      "idUtente": idUtenteDaAssociare
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/users/addCliente", requestOptions)
      .then(response => {
        if (response.status === 200) {
          loadCustomers();
          setShowAssociaAdAltroUtente(false);
        }
      })
      .catch(error => {
        console.log('error', error);
        alert(error.message);
      });
  }

  function confermaAssociazioneAltroCliente() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "idClienteDaAggiungere": idClienteDaAssociare,
      "idUtente": id
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/users/addCliente", requestOptions)
      .then(response => {
        if (response.status === 200) {
          loadCustomers();
          setShowAssociaAdCliente(false);
        }
      })
      .catch(error => {
        console.log('error', error);
        alert(error.message);
      });
  }

  function aggiornaCliente(id) {

    history.push({
      pathname: `/customers/${id}`,
      state: [{
        userId: id
      }]
    });

  }

  function confermaEliminazione() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/customers/" + clienteSeleazionato, requestOptions)
      .then(response => {
        if (response.status === 200) {
          loadCustomers();

        }
      })
      .catch(error => {
        console.log('error', error);
        alert(error.message);
      });

    setShowDelete(false);
  }

  function loadCustomers() {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch("http://localhost:8080/customers/" + userId, requestOptions)
        //.then(response =>  response.text())
        .then(response => {
          if (response.status === 200) {
            response.json().then(data => {
              // console.log(data);
              setCustomers(data);

            })
          }
        })
        .catch(error => {
          console.log('error', error);
          alert(error.message);
        });
    } catch (e) {
      onError(e);
      // alert(e);
    }
  }

  function loadUtenti() {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch("http://localhost:8080/users/" + userId, requestOptions)
        //.then(response =>  response.text())
        .then(response => {
          if (response.status === 200) {
            response.json().then(data => {

              const options = data.map(d => ({
                "value": d.id,
                "label": d.nome + " " + d.cognome
              }));
              
              setUtenti(options);
     
            })
          }
        })
        .catch(error => {
          console.log('error', error);
          alert(error.message);
        });
    } catch (e) {
      onError(e);
      // alert(e);
    }
  }

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      console.log(userId + " UTENTE: " + nomeUtente + " " + cognomeUtente);

      try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch("http://localhost:8080/customers/" + userId, requestOptions)
          //.then(response =>  response.text())
          .then(response => {
            if (response.status === 200) {
              response.json().then(data => {
                // console.log(data);
                setCustomers(data);

              })
            }
          })
          .catch(error => {
            console.log('error', error);
            alert(error.message);
          });

      } catch (e) {
        onError(e);
      }


    }
    setIsLoading(false);
    onLoad();
  }, [isAuthenticated, userId, setCustomerId]);

  function handleSelectChange(e) {

    setIdClienteDaAssociare(e.value);
  }

  function handleUtentiSelectChange(e) {

    if (e.value != null){
      setShowAssociaConfirmaButton(true);
      setIdUtenteDaAssociare(e.value);
      console.log("CLIENTE " + idClienteDaAssociare);
      console.log("UTENTE " + idUtenteDaAssociare);
    }
   
  }

  function creaCliente() {
    history.push({
      pathname: `/customers/new`,
      state: [{
        userId: userId
      }]
    });
  }

  function checkAltriClienti() {
    if (clientiNonAssociati.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  function renderCustomersList(Customers) {
    return (
      <>
       
        <h2 className="pb-3 mt-4 mb-3 border-bottom">
        <Button variant="outline-success" style={{ marginRight: "10px" }} onClick={loadCustomers}>
          <AiOutlineReload />
        </Button>
        Clienti di {nomeUtente} {cognomeUtente}
        
        </h2>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" className="-striped -highlight">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }} > {column.label} </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {
                customers.map((cliente) => (
                  <TableRow key={cliente.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                  >
                    <TableCell component="th" scope="row" className="font-weight-bold"> {cliente.ragioneSociale}</TableCell>
                    <TableCell align="center">{cliente.partitaIva}</TableCell>
                    <TableCell align="center">{cliente.nazione}</TableCell>
                    <TableCell align="center">{cliente.descrizione}</TableCell>

                    <TableCell align="left">

                      <OverlayTrigger placement="top" overlay={renderEditTooltip}>
                        <Button style={{ marginRight: "5px" }}>  <AiOutlineEdit onClick={(e) => editCliente(cliente.id, cliente.ragioneSociale)} /> </Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={renderProjectTooltip}>
                        <Button style={{ marginRight: "5px" }}>  <GoProject onClick={(e) => aggiornaCliente(cliente.id, cliente.ragioneSociale)} /> </Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={renderAssociaTooltip}>
                        <Button style={{ marginRight: "5px" }}>  <AiOutlineLink onClick={(e) => associaCliente(cliente.id, cliente.ragioneSociale)} /> </Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={renderEliminaTooltip}>
                        <Button> <RiDeleteBin6Line onClick={(e) => eliminaCliente(cliente.id, cliente.ragioneSociale)} /> </Button>
                      </OverlayTrigger>
                      <Modal show={showDelete} onHide={() => setShowDelete(false)} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title>Cancellare il CLIENTE {ragioneSocialeClienteSelezionato}?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>L'operazione non è reversibile</Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowDelete(false)}>
                            Annulla
                          </Button>
                          <Button variant="primary" onClick={(e) => confermaEliminazione()} >
                            Conferma
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <Modal show={showAssociaAdAltroUtente} onHide={() => setShowAssociaAdAltroUtente(false)} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title>Associare il cliente {ragioneSocialeClienteSelezionato} ad un altro utente</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                        <Select options={utenti} onChange={handleUtentiSelectChange} />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowAssociaAdAltroUtente(false)}>
                            Annulla
                          </Button>
                          <Button variant="primary" onClick={(e) => confermaAssociazione()} disabled={!showAssociaConfirmaButton}>
                            Conferma
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    
                      <Modal show={showModificaCliente} onHide={() => setShowModificaCliente(false)} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title> Modifica cliente {ragioneSocialeClienteSelezionato}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                          <div align="center">
                            <RiTodoFill size={"150px"} />
                            <br /> <br />TODO
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowModificaCliente(false)}>
                            Annulla
                          </Button>
                          <Button variant="primary" onClick={(e) => confermaModificaCliente()} disabled="true">
                            Conferma
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <Modal show={showAssociaAdAltroCliente} onHide={() => setShowAssociaAdCliente(false)} animation={false} componentDidMount={loadClienti}>
                        <Modal.Header closeButton>
                          <Modal.Title>Associare l'utente a Cliente già esistente</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Associare l'utente ad uno dei seguenti clienti
                          <Select options={clientiNonAssociati} onChange={handleSelectChange} />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowAssociaAdCliente(false)}>
                            Annulla
                          </Button>
                          <Button variant="primary" onClick={confermaAssociazioneAltroCliente} disabled={checkAltriClienti()}>
                            Conferma
                          </Button>
                        </Modal.Footer>
                      </Modal>

                    </TableCell>
                  </TableRow>
                ))}

            </TableBody>

          </Table>
        </TableContainer>
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>iDcos</h1>
        <p className="text-muted">Gestione Documentale</p>
      </div>
    );
  }

  function renderCustomers() {
    return (
      <div className="customers">

        <ListGroup>{!isLoading && renderCustomersList(customers)}</ListGroup>
        <br />
        <Button variant="outline-primary" onClick={creaCliente}>+ Crea nuovo cliente</Button>{'    '}
        <Button variant="outline-secondary" onClick={associaUtente}>{">"} Associa altro cliente</Button>{' '}
      </div>
    );
  }

  return (
    <div className="Utente">
      {isAuthenticated ? renderCustomers() : renderLander()}
    </div>
  );
}
