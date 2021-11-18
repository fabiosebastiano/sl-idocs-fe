import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import "./Home.css";
import { onError } from "../lib/errorLib";
import {  BsPlusSquare} from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const { isAuthenticated, userId , setCustomerId} = useAppContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      console.log(">>>>> HOME CON UTENTE: ", userId);
      if (!isAuthenticated) {
        return;
      }

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
        // const customers = loadCustomers();
        // setCustomers(customers);
      } catch (e) {
        onError(e);
        // alert(e);
      }

      
    }
    setIsLoading(false);
    onLoad();
  }, [isAuthenticated, userId, setCustomerId]);


  function renderCustomersList(Customers) {
    return (
      <>
        <LinkContainer to={{pathname: "/customers/new", userId:{userId}}}>
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPlusSquare size={17} />
            <span className="ml-2 font-weight-bold">Crea un nuovo cliente</span>
          </ListGroup.Item>
          </LinkContainer>
          {customers.map(({ id, ragioneSociale, partitaIva }) => (
            <LinkContainer key={id} to={`/customers/${id}`}>
              <ListGroup.Item action>
                <span className="font-weight-bold">  {ragioneSociale} </span>
                <span >   {partitaIva} </span>
                <RiDeleteBin6Line size={17} className="float-right" />
                <FiEdit2 size={17} className="float-right" />
                <br />
              </ListGroup.Item>
            </LinkContainer>
          ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>iDocs</h1>
        <p className="text-muted">Gestione Documentale</p>
      </div>
    );
  }

  function renderCustomers() {
    return (
      <div className="customers">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">I tuoi clienti</h2>
        <ListGroup>{!isLoading && renderCustomersList(customers)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderCustomers() : renderLander()}
    </div>
  );
}