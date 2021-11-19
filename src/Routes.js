import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NuovoCliente from "./containers/NuovoCliente";
import Cliente from "./containers/Cliente";
import Progetto from "./containers/Progetto";
import NuovoProgetto from "./containers/NuovoProgetto";
import NuovoDocumento from "./containers/NuovoDocumento";
import Utente from "./containers/Utente";
//import AssociaCliente from "./containers/AssociaCliente";

export default function Routes() {
  return (
    <Switch>
     
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/utente/:id">
        <Utente />
      </Route>
      <Route exact path="/customers/new">
        <NuovoCliente />
      </Route>
      <Route exact path="/customers/:id">
        <Cliente />
      </Route>
      {/** 
      <Route exact path="/customerslist">
        <AssociaCliente />
      </Route>
      */}
      <Route exact path="/projects/new">
        <NuovoProgetto />
      </Route>
      <Route exact path="/projects/:id">
        <Progetto />
      </Route>
      <Route exact path="/documents/new">
        <NuovoDocumento />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}