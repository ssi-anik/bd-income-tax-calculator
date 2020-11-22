import React, {useState} from 'react';
import {Button, Modal, Nav, Navbar} from "react-bootstrap";
import 'github-fork-ribbon-css/gh-fork-ribbon.css';

export default function TopNav() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return <>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="./">BD Income tax calculator</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav"/>
            <Navbar.Collapse id="navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link onClick={handleShow}>Disclaimer</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>

        <a target = "_blank" className = "github-fork-ribbon right-top fixed"
           href = "https://github.com/ssi-anik/bd-income-tax-calculator"
           rel = "noopener noreferrer"
           data-ribbon = "Star me on GitHub" title = "Star me on GitHub">
            Star me on GitHub
        </a>

        <Modal show={show} keyboard={true} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Disclaimer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-danger">
                    I'm not a Lawyer. I have gone through some sources that are listed below. It's
                    not guaranteed to be 100% accurate.
                </p>
                <hr/>
                <ul>
                    <li>
                        <a rel="noopener noreferrer" href="https://youtu.be/PkzN7CTS2F0" target="_blank">YT Link 1</a>
                    </li>
                    <li>
                        <a rel="noopener noreferrer" href="https://youtu.be/MARJMGB083Y" target="_blank">YT Link 2</a>
                    </li>
                    <li>
                        <a rel="noopener noreferrer" href="https://youtu.be/5KFcEvMRwuc" target="_blank">YT Link 3</a>
                    </li>
                </ul>
                <hr/>
                <ul>
                    <li>
                        <a rel="noopener noreferrer" href="https://youtu.be/7QWAmoFLCso" target="_blank">YT Link 4</a>
                    </li>
                </ul>
                <hr/>
                <ul>
                    <li>
                        <a rel="noopener noreferrer" href="https://rb.gy/oajabb" target="_blank">News Link 1</a>
                    </li>
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>;
}