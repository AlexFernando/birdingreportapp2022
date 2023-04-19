import React from "react";
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../components/Home'
import StatisticsComponent from '../components/Statistics'
import UpdateFiles from '../components/updateFiles';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, NavDropdown, Navbar, Container, Alert } from "react-bootstrap";
import { faHandHoldingMedical } from "@fortawesome/free-solid-svg-icons";

const NavbarComponent = () => {
  return (
    <>
        <>
          <Navbar bg="dark" variant="dark">
              <Nav className="me-auto">
                <Nav.Link as={Link} to='/'>Home</Nav.Link>
                <Nav.Link as={Link} to='/statistics'>Statistics</Nav.Link>
                <Nav.Link as={Link} to='/updatefiles'>Update Files</Nav.Link>
              </Nav>
          </Navbar>
        </>

        <div>
          <Routes>            
            <Route exact path='/' element={<Home />} />
            <Route exact path='/statistics' element={<StatisticsComponent/>}/>
            <Route exact path='/updatefiles' element={<UpdateFiles/>}/>
          </Routes>
        </div>
    </>
  );
};

export default NavbarComponent;