import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { onError } from "../lib/errorLib";
import {  AiOutlineEdit, AiOutlineReload } from "react-icons/ai";
import {RiTodoFill } from  "react-icons/ri";
import { HiOutlineDocumentDuplicate} from "react-icons/hi";


import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useHistory } from "react-router-dom";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function ClienteNew() {

  const { id  } = useParams();

  const history = useHistory();
  const [ragioneSociale, setRagioneSociale] = useState("");
  const [listaProgetti, setProgetti] = useState([]);
  const [nomeProgettoSelezionato, setNomeProgetto] = useState("");
  const [progettoSelezionato, setProgettoSelezionato] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const { userHasAuthenticated,  userId, userGetLoggedIn} = useAppContext();
  const [showModificaProgetto, setShowModificaProgetto] = useState(false);

  const renderDocsTooltip = props => (
    <Tooltip {...props}>Vai ai documenti del progetto</Tooltip>
  );

  const renderEliminaTooltip = props => (
    <Tooltip {...props}>Elimina progetto</Tooltip>
  );

  const renderEditTooltip = props => (
    <Tooltip {...props}>Modifica progetto</Tooltip>
  );

  var { idCliente } = useAppContext();

  const columns = [
    { id: 'nome', label: 'PROGETTO', align: 'left', sortable: true, disableClickEventBubbling: true },
    { id: 'Descrizione', label: 'NOTE', align: 'center', disableClickEventBubbling: true },
    {
      id: 'edit', label: '', align: 'left', disableClickEventBubbling: true
    }
  ];

  function editProgetto(id, nome){
    setNomeProgetto(nome);
    setShowModificaProgetto(true);
  };

  function loadCliente() {
    // setCliente(id);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/customers/single/" + id, requestOptions)
      //.then(response =>  response.text())
      .then(response => {
        if (response.status === 200) {

          response.json().then(data => {
            
            setRagioneSociale(data.ragioneSociale);

          })
        }
      })
      .catch(error => {
        console.log('error', error);
        alert(error.message);
      });

  }

  useEffect(() => {
    userHasAuthenticated(true);
    async function onLoad() {
      try {
        loadCliente();
        loadProgetti();
        console.log("----FINE USE EFFECT che utente >>> "+ userId);
      } catch (e) {
        onError(e);
      }

    }

    onLoad();

  }, [id, idCliente]);

  function loadProgetti() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    console.log("CARICO PROGETTI PER CLIENTE " + idCliente + " OPPURE "+ id);
    fetch("http://localhost:8080/projects/" + id, requestOptions)
      //.then(response =>  response.text())
      .then(response => {
        if (response.status === 200) {

          response.json().then(data => {

            setProgetti(data);

          })
        }
      })
      .catch(error => {
        console.log('error', error);
        alert(error.message);
      });

  }

  function aggiornaProgetto(idProgetto) {
    history.push({
      pathname: `/projects/${idProgetto}`,
      state: [{
        clientId: id
      }]
    });

  }
  /*
  function loadUtenti(){
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch("http://localhost:8080/users/"+userId, requestOptions)
        //.then(response =>  response.text())
        .then(response => {
          if (response.status === 200) {
            response.json().then(data => {
              console.log(data);
              setUtenti(data);
              console.log(utenti);
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
*/


  function confermaEliminazione() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/projects/" + progettoSelezionato, requestOptions)
      .then(response => {
        if (response.status === 200) {
          loadProgetti();

        }
      })
      .catch(error => {
        console.log('error', error);
        alert(error.message);
      });

    setShowDelete(false);
  }

  function eliminaProgetto(idProgetto, identificativo) {
    setProgettoSelezionato(idProgetto);
    setNomeProgetto(identificativo);
    setShowDelete(true);
  }

  function creaProgetto(){
    history.push({
      pathname: `/projects/new`,
      state: [{
        clientId: id
      }]
    });
  }

  function renderProjectsList(progetti) {
    return (
      <>
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
                listaProgetti.map((progetto) => (
                  <TableRow key={progetto.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                  >
                    <TableCell component="th" scope="row" className="font-weight-bold"> {progetto.nome}</TableCell>
                    <TableCell align="center">{progetto.descrizione}</TableCell>

                    <TableCell align="right">
                      
                      <OverlayTrigger placement="top" overlay={renderDocsTooltip}>
                        <Button style={{ marginRight: "5px" }}>  <HiOutlineDocumentDuplicate onClick={(e) => aggiornaProgetto(progetto.id)} /> </Button>
                      </OverlayTrigger>
                     
                      <OverlayTrigger placement="top" overlay={renderEditTooltip}>
                        <Button style={{marginRight: "5px"}}>  <AiOutlineEdit onClick={(e) => editProgetto(progetto.id, progetto.nome)} /> </Button>
                      </OverlayTrigger>

                      <OverlayTrigger placement="top" overlay={renderEliminaTooltip}>
                        <Button>
                          <RiDeleteBin6Line onClick={(e) => eliminaProgetto(progetto.id, progetto.nome)} />
                        </Button>
                      </OverlayTrigger>

                    
                    </TableCell>
                  </TableRow>
                ))}

            </TableBody>

          </Table>
        </TableContainer>
        <Modal show={showDelete} onHide={() => setShowDelete(false)} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title>Cancellare il progetto <b>{nomeProgettoSelezionato}</b> ?</Modal.Title>
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
                      <Modal show={showModificaProgetto} onHide={() => setShowModificaProgetto(false)} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title> Modifica progetto <b>{nomeProgettoSelezionato}</b></Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                          <div align="center">
                            <RiTodoFill size={"150px"} />
                            <br /> <br />TODO
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowModificaProgetto(false)}>
                            Annulla
                          </Button>
                          <Button variant="primary" disabled="true">
                            Conferma
                          </Button>
                        </Modal.Footer>
                      </Modal>
      </>
    );
  }

  function renderProjects() {
    return (
      <div className="progetti">
        <h2 className="ml-2 pb-3 mt-4 mb-3 border-bottom">
        <Button variant="outline-success" style={{ marginRight: "10px" }} onClick={loadProgetti}>
          <AiOutlineReload />
        </Button>
          Progetti del cliente <b>{ragioneSociale}</b></h2>
        <ListGroup>{renderProjectsList(listaProgetti)}</ListGroup>
        <br />
        <Button variant="outline-primary" onClick={creaProgetto}>+ Crea nuovo progetto</Button>{'    '}
      </div>

    );
  }

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" 
         state={
          { 
             userHasAuthenticated: true, 
             userId: userId,
             clientId: id
          }
         }
        onClick={() => {
          console.log("DA CLIENTE TORNO ALLA HOME con userId "+ userId);
          userGetLoggedIn(userId);
          userHasAuthenticated(true);

          history.push({
            pathname: `/utente/`+userId,
            state: [{
              clientId: id,
              userId: userId,
              userHasAuthenticated: true
            }]
          });
        }}
        >
          Clienti
        </Link>
        <Typography color="text.primary">Progetti</Typography>
      </Breadcrumbs>
      <div>
        {renderProjects()}
      </div>
    </>
  );
}
