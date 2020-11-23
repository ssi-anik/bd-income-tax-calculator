import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, Row} from "react-bootstrap";
import TopNav from "./TopNav";
import LeftSideContent from "./LeftSideContent";
import RightSideContent from "./RightSideContent";

function today() {
    return new Date().toLocaleDateString([], {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
    }).replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, "$3$1$2");
}

function namespace() {
    return 'bd-income-tax-calculator';
}

function App() {

    const [values, setValues] = useState({
        lowerBound: 300000,
        minimumTax: 5000,
        companies: [],
        lifetimeVisitor: 0,
        dailyVisitor: 0
    });

    const {companies} = values;

    function handleInputChange(field, value) {
        setValues(prev => ({
            ...prev,
            [field]: field === 'companies' ? [...prev['companies'], value] : value
        }));
    }

    function removeCompany(id) {
        setValues(prev => ({
            ...prev,
            'companies': prev['companies'].filter(c => c.id !== id),
        }))
    }

    useEffect(() => {
        // get site lifetime visitors
        window.fetch(`https://api.countapi.xyz/hit/${namespace()}`).then(res => res.json()).then(response => {
            handleInputChange('lifetimeVisitor', response.value ?? 0);
        }).catch(error => {
            console.log("Cannot get lifetime visitor.");
            console.log(error);
        });

        // get site daily visitors
        window.fetch(`https://api.countapi.xyz/hit/${namespace()}-${today()}`).then(res => res.json()).then(response => {
            handleInputChange('dailyVisitor', response.value ?? 0);
        }).catch(error => {
            console.log("Cannot get today's visitor.");
            console.log(error);
        });

    }, []);

    return (
        <>
            <TopNav daily={values['dailyVisitor']} lifetime={values['lifetimeVisitor']}/>
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
