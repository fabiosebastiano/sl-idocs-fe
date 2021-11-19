import React, {  useState, useEffect} from "react";
import { useParams , useLocation, useHistory} from "react-router-dom";
import { onError } from "../lib/errorLib";

import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEdit ,AiFillLike, AiFillDislike, AiOutlineReload } from "react-icons/ai";
import ListGroup from "react-bootstrap/ListGroup";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppContext } from "../lib/contextLib";


import Moment from 'moment';

export default function ClienteNew() {
  const history = useHistory();
  const { id } = useParams();
  const [nomeProgetto, setNomeProgetto]             = useState("");
  const [documentoCliccato, setDocumentoCliccato]   = useState(null);
  const [nomeDoc, setNomeDocumentoCliccato]         = useState("");
  const [showDelete, setShowDelete]                 = useState(false);
  const [showApprova, setShowApprova]               = useState(false);
  const { state }  = useLocation();
  const [listaDocumenti, setDocumenti]        = useState([]);
  const { userHasAuthenticated, userId,  userGetLoggedIn } = useAppContext();
  

  const renderApprovaTooltip = props => (
    <Tooltip {...props}>Approva o rifiuta il documento</Tooltip>
  );

  const renderEliminaTooltip = props => (
    <Tooltip {...props}>Elimina documento</Tooltip>
  );
  const renderEditTooltip = props => (
    <Tooltip {...props}>Modifica documento</Tooltip>
  );
  const columns = [
    { id: 'name', label: 'NOME',  align: 'left',  sortable: true, disableClickEventBubbling: true },
    { id: 'estensione', label: 'ESTENSIONE',  align: 'center',  type: 'number'  , disableClickEventBubbling: true},
    { id: 'dimensione', label: 'DIMENSIONE \u00a0(KB)',  align: 'center' , disableClickEventBubbling: true},
    { id: 'descrizione', label: 'DESCRIZIONE',  align: 'center' , disableClickEventBubbling: true},
    { id: 'dataCaricamento', label: 'DATA CARICAMENTO', align: 'center' , disableClickEventBubbling: true },
    { id: 'stato', label: 'STATO',  align: 'center', disableClickEventBubbling: true},
    { id: 'edit', label: '', align: 'left',  disableClickEventBubbling: true, renderCell: (params)=> {
      return <Button>
      <RiDeleteBin6Line
         onClick={(e)=> eliminaDocumento(id)}/>
      </Button>   ;
    }}
  ];

  function editDocumento(id, nome){

  };

/*   function renderApprovato(dataCambioStato) {
    if(dataCambioStato != null) {
      return (<span>in data {dataCambioStato}</span>) ;
    } else {
      return (<span>Da approvare</span>) ;
    }
  } */

  function renderDaApprovare(documento) {

    if(documento.dataCambioStato == null)  {
      return (
          <>
            <OverlayTrigger placement="top" overlay={renderApprovaTooltip}>
              <Button onClick={(e)=> approvazioneDocumento(documento.id, documento.nome)}><AiFillLike /></Button>
              </OverlayTrigger>
          </>)
    }
  }

  useEffect(() => {
    function loadProgetto() {

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch("http://localhost:8080/projects/single/" + id, requestOptions)
          .then(response => {
            if (response.status === 200) {
              response.json().then(data => {
                setNomeProgetto(data.nome);
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
          loadProgetto();
          loadDocumenti();
      } catch (e) {
        onError(e);
      }

    }


    onLoad();

  }, [id]);

  function loadDocumenti() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/docs/" + id, requestOptions)
        .then(response => {
          if (response.status === 200) {
            response.json().then(data => {
              setDocumenti(data);
              console.log(data);
            })
          }
        })
        .catch(error => {
          console.log('error', error);
          alert(error.message);
        });

  }



  function cambiaStatoDocumento(idDocumento, isApproved) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow'
    };
    let url =  (isApproved) ? "http://localhost:8080/docs/approva/": "http://localhost:8080/docs/rifiuta/";
    fetch(url + documentoCliccato, requestOptions)
    .then(response => {
      if (response.status === 200) {
        response.json().then(data => {
          //history.push("/projects/"+id);
          setShowApprova(false);
           loadDocumenti();
          //setDocumenti(data);
        })
      }
    })
    .catch(error => {
      console.log('error', error);
      alert(error.message);
    });

  }

  function approvazioneDocumento(id, nome){
    setNomeDocumentoCliccato(nome);
    setDocumentoCliccato(id);

    setShowApprova(true);

  }
  function rifiutaDocumento(item){
    cambiaStatoDocumento(documentoCliccato, false);
    //setShowApprova(false);
  }

  function approvaDocumento(item){
    cambiaStatoDocumento(documentoCliccato, true);
  }

  function eliminaDocumento(id, nome, estensione){
    setDocumentoCliccato(id);
    setNomeDocumentoCliccato(nome+"."+estensione);

    setShowDelete(true);
  }

   function confermaEliminazione () {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/docs/" + documentoCliccato, requestOptions)
    .then(response => {
      if (response.status === 200) {
          loadDocumenti();

      }
    })
    .catch(error => {
      console.log('error', error);
      alert(error.message);
    });

    setShowDelete(false);
  }

  function caricaDocumento(){
    history.push({
      pathname: `/documents/new`,
      state: [{
        projectId: id,
        nomeProgetto: nomeProgetto, 
        clientId: state[0].clientId 
      }]
    });


  }

  function renderDocumentsList(documenti) {
    Moment.locale('it');
    return (
      <>

        <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" className="-striped -highlight">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}  align={column.align} style={{ minWidth: column.minWidth }} > {column.label} </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {
            listaDocumenti.map((documento) => (
              <TableRow key={documento.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

              >
                  <TableCell component="th" scope="row" className="font-weight-bold"> {documento.nome}</TableCell>
                  <TableCell align="center">{documento.estensione}</TableCell>
                  <TableCell align="center">{documento.dimensione}</TableCell>
                  <TableCell align="center">{documento.descrizione}</TableCell>
                  <TableCell align="center">
                    {
                    Moment(documento.dataCaricamento).format('DD/MM/YYYY')
                    }</TableCell>
                  <TableCell align="center" className="font-weight-bold">{documento.stato}</TableCell>
                  <TableCell align="left">
                  <OverlayTrigger placement="top" overlay={renderEditTooltip}>
                        <Button style={{marginRight: "5px"}}>  <AiOutlineEdit onClick={(e) => editDocumento(documento.id, documento.nome, documento.estensione)} /> </Button>
                      </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={renderEliminaTooltip}>
                    <Button style={{marginRight: "5px"}}>
                      <RiDeleteBin6Line size={17}  onClick={(e)=> eliminaDocumento(documento.id, documento.nome, documento.estensione)}/>
                    </Button>
                    </OverlayTrigger>
                    <Modal show={showDelete} onHide={() => setShowDelete(false)} animation={false}>
                    <Modal.Header closeButton>
                      <Modal.Title>Cancellare il documento {nomeDoc}?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>L'operazione non è reversibile</Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={() => setShowDelete(false)}>
                        Annulla
                      </Button>
                      <Button variant="primary" onClick={(e)=> confermaEliminazione()} >
                        Conferma
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Modal show={showApprova} onHide={() => setShowApprova(false)} animation={false} >
                  <Modal.Header closeButton>
                    <Modal.Title>Approvazione documento <h5>{nomeDoc}</h5></Modal.Title>
                  </Modal.Header>
                    <Modal.Body>
                        <h3 align="center">Vuoi approvare o rifiutare il documento?</h3>
                        <div align="center">
                          <Button style={{marginRight: "20px", backgroundColor:"#29212180"}} onClick={(e)=> rifiutaDocumento(id)}><AiFillDislike size={30} className="float-right" />Rifiuta</Button>
                          <Button style={{backgroundColor:"#13996c80"} }onClick={(e)=> approvaDocumento(id)}><AiFillLike size={30} className="float-right" />Approva</Button>
                        </div>
                    </Modal.Body>

                </Modal>
                    {
                      renderDaApprovare(documento)
                    }
                  </TableCell>
              </TableRow>
              ))}

          </TableBody>
        </Table>
      </TableContainer>
     
      </>
    );
  }

  function renderDocuments() {
    return (
      <div className="documenti">
        <h2 className="ml-2 pb-3 mt-4 mb-3 border-bottom">
        <Button variant="outline-success" style={{ marginRight: "10px" }} onClick={loadDocumenti}>
          <AiOutlineReload />
        </Button>Documenti del progetto: {nomeProgetto}</h2>
        <ListGroup>{renderDocumentsList(listaDocumenti)}</ListGroup>
        <br />
        <Button variant="outline-primary" onClick={caricaDocumento}>+ Carica documento</Button>{'    '}
      </div>
    );
  }

  return (
    <>

    <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href={"/utente/"+userId}
        onClick={() => {
          userGetLoggedIn(userId);
          userHasAuthenticated(true);
          console.log("!!! ON CLICK BREADCRUMB!!!")
        }
        }>
          Clienti
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href={"/customers/"+state[0].clientId}
          onClick={() => {
            userGetLoggedIn(userId);
            userHasAuthenticated(true);
            console.log("!!! ON CLICK BREADCRUMB!!!")
          }
          }
        >
          Progetti
        </Link>
        <Typography color="text.primary">Documenti</Typography>
      </Breadcrumbs>

    <div>
      {renderDocuments()}
    </div>

    </>
  );
}
