import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { onError } from "../lib/errorLib";
import { BsPlusSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { HiOutlineDocumentDuplicate} from "react-icons/hi";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useHistory, useLocation } from "react-router-dom";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from 'react-select'

export default function ClienteNew() {

  const { id, userId } = useParams();
  const history = useHistory();
  const [ragioneSociale, setRagioneSociale] = useState("");
  const [listaProgetti, setProgetti] = useState([]);
  const [nomeProgettoSelezionato, setNomeProgetto] = useState("");
  const [progettoSelezionato, setProgettoSelezionato] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [utenti, setUtenti]         = useState([]);


  const renderDocsTooltip = props => (
    <Tooltip {...props}>Vai ai documenti del progetto</Tooltip>
  );

  const renderEliminaTooltip = props => (
    <Tooltip {...props}>Elimina progetto</Tooltip>
  );

  var { idCliente } = useAppContext();

  const columns = [
    { id: 'nome', label: 'IDENTIFICATIVO', align: 'left', sortable: true, disableClickEventBubbling: true },
    { id: 'Descrizione', label: 'DESCRIZIONE', align: 'center', disableClickEventBubbling: true },
    {
      id: 'edit', label: '', align: 'left', disableClickEventBubbling: true
    }
  ];

  useEffect(() => {

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



    async function onLoad() {
      try {
        loadCliente();
        loadProgetti();

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

                    <TableCell align="left">
                      <OverlayTrigger placement="top" overlay={renderDocsTooltip}>
                        <Button style={{ marginRight: "5px" }}>  <HiOutlineDocumentDuplicate onClick={(e) => aggiornaProgetto(progetto.id)} /> </Button>
                      </OverlayTrigger>

                      <OverlayTrigger placement="top" overlay={renderEliminaTooltip}>
                        <Button>
                          <RiDeleteBin6Line onClick={(e) => eliminaProgetto(progetto.id, progetto.nome)} />
                        </Button>
                      </OverlayTrigger>

                      <Modal show={showDelete} onHide={() => setShowDelete(false)} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title>Cancellare il progetto {nomeProgettoSelezionato}?</Modal.Title>
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
                      {/*
                      <Modal show={showAssociaAdAltroUtente} onHide={() => setShowAssociaAdAltroUtente(false)} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title>{nomeProgettoSelezionato}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Associare il progetto ad uno dei seguenti utenti
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowAssociaAdAltroUtente(false)}>
                            Annulla
                          </Button>
                          <Button variant="primary" onClick={(e) => confermaAssociazione()} >
                            Conferma
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      */}
                    </TableCell>
                  </TableRow>
                ))}

            </TableBody>

          </Table>
        </TableContainer>

{/*         <LinkContainer id="lc" to={{ pathname: "/projects/new", state: [{ clientId: id }] }}>
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPlusSquare size={17} />
            <span className="ml-2 font-weight-bold">Crea un nuovo progetto</span>
          </ListGroup.Item>

        </LinkContainer> */}

      </>
    );
  }

  function renderProjects() {
    return (
      <div className="progetti">
        <h2 className="ml-2 pb-3 mt-4 mb-3 border-bottom">Progetti del cliente {ragioneSociale}</h2>
        <ListGroup>{renderProjectsList(listaProgetti)}</ListGroup>
        <br />
        <Button variant="outline-primary" onClick={creaProgetto}>+ Crea nuovo progetto</Button>{'    '}
      </div>

    );
  }

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href={"/utente/" + id}>
          Clienti
        </Link>

      </Breadcrumbs>
      <div>
        {renderProjects()}
      </div>
    </>
  );
}
