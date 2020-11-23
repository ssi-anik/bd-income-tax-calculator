import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, Row} from "react-bootstrap";
import TopNav from "./TopNav";
import LeftSideContent from "./LeftSideContent";
import RightSideContent from "./RightSideContent";

function App() {

    const [values, setValues] = useState({
        lowerBound: 300000,
        minimumTax: 5000,
        companies: [],
    });
    const {companies} = values;

    function handleInputChange(field, value) {
        console.log(field, value);
        setValues(prev => ({
            ...prev,
            [field]: field === 'companies' ? [...prev['companies'], value] : value
        }));
    }

    function removeCompany(id) {
        setValues(prev => ({
            ...prev,
            ['companies']: prev['companies'].filter(c => c.id != id),
        }))
    }

    return (
        <>
            <TopNav/>
            <Container fluid>
                <Row style={{marginTop: 3}}>
                    <Col xs={12} md="8">
                        <LeftSideContent
                            handleInputChange={handleInputChange}
                            companies={companies}
                            removeCompany={removeCompany}
                        />
                    </Col>
                    <Col xs={12} md="4">
                        <RightSideContent
                            values={values}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default App;
