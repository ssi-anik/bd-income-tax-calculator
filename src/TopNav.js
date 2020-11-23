import React, {useState} from 'react';
import {Button, Modal, Nav, Navbar} from "react-bootstrap";
import 'github-fork-ribbon-css/gh-fork-ribbon.css';

export default function TopNav(props) {
    const [disclaimer, setDisclaimer] = useState(false);
    const [howTo, setHowTo] = useState(false);

    const handleDisclaimerClose = () => setDisclaimer(false);
    const handleDisclaimerShow = () => setDisclaimer(true);

    const handleHowToClose = () => setHowTo(false);
    const handleHowToShow = () => setHowTo(true);

    const {lifetime, daily} = props;

    return <>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="./">BD Income tax calculator</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav"/>
            <Navbar.Collapse id="navbar-nav">
                <Nav className="mr-1">
                    <Nav.Link className="text-warning" onClick={handleDisclaimerShow}>Disclaimer</Nav.Link>
                </Nav>
                <Nav className="mr-1">
                    <Nav.Link className="text-info" onClick={handleHowToShow}>How to use?</Nav.Link>
                </Nav>
                <Nav className="mr-2">
                    <Navbar.Text className="text-white">Lifetime visitor: {lifetime}</Navbar.Text>
                </Nav>
                <Nav className="mr-2">
                    <Navbar.Text className="text-white">Daily Visitor: {daily}</Navbar.Text>
                </Nav>
            </Navbar.Collapse>
        </Navbar>

        <a target="_blank" className="github-fork-ribbon right-top fixed"
           href="https://github.com/ssi-anik/bd-income-tax-calculator"
           rel="noopener noreferrer"
           data-ribbon="Star me on GitHub" title="Star me on GitHub">
            Star me on GitHub
        </a>

        <Modal show={disclaimer} keyboard={true} animation={false} onHide={handleDisclaimerClose} backdrop="static">
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
                <Button variant="secondary" onClick={handleDisclaimerClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={howTo} keyboard={true} animation={false} onHide={handleHowToClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>How to use?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-success">
                    All the calculations are done in front-end/browser. No data is being sent to the backend or server.
                    If you reload the page, all the data will be gone from the page. And all the calculations are done
                    in the realtime. So, you can change the values.
                </p>
                <hr/>
                <p className="text-info">
                    If you're a developer, then don't forget to click the star button on this repository by clicking
                    "Star me on Github"
                </p>
                <hr/>
                <ul>
                    <li>Select if you're male, female or have any other privilege</li>
                    <li>Select your age group.</li>
                    <li>Input the minimum tax amount applicable for your area.</li>
                </ul>
                <hr/>
                <ul>
                    <li>Enter the company name you worked for.</li>
                    <li>Number of months you worked there. Default is 12.</li>
                    <li>Number of festivals you got within those months. Default is 2.</li>
                    <li>
                        If you want to calculate per months basis, select "Calculate from Monthly".
                        Otherwise, you if you have your annual salary certificate, you can calculate from there.
                    </li>
                </ul>
                <hr/>
                <ul>
                    <li>Enter the salary breakdown as specified in the fields.</li>
                    <li>
                        Festival bonus are multiplied by the no of festivals specified.
                    </li>
                    <li>Other taxable bonus are the
                        total amount of taxable bonus you received like "Leave encashment", "PF"
                    </li>
                    <li>Press Calculate button or reset if you want to calculate or reset.</li>
                    <li>You can remove existing entry by clicking the remove button under the listing table.</li>
                    <li>
                        You can use as many companies as you want. In case you've got an increment in the mid of a FY.
                    </li>
                </ul>
                <hr/>
                <ul>
                    <li>
                        AIT/Advance Income Tax is the tax deducted by the office per month basis.
                        Insert a value if they did.
                    </li>
                    <li>
                        Allowable investments are the investments that are counted as investment.
                        Enter the sum of allowed investments.
                    </li>
                </ul>
                <hr/>
                <p className="text-info">
                    You'll then be able to see the available information as well as the tax
                    breakdown.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleHowToClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>;
}