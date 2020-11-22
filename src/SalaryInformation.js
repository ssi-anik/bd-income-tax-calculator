import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {useRef, useState} from "react";

export default function SalaryInformation(props) {
    const [companyNameRef, monthsRef, totalFestivalsRef, calculationTypeRef] = [useRef(), useRef(), useRef(), useRef()];
    const [companyInfoRef, salaryInputRef] = [useRef(), useRef()];

    const [basicRef, houseRef, medicalRef, conveyanceRef] = [useRef(), useRef(), useRef(), useRef()];
    const [lfaRef, festivalRef, otherTaxableRef] = [useRef(), useRef(), useRef()];

    const initialCompanyInfo = {
        company: '',
        months: 12,
        festivals: 2,
        calculationType: 'monthly'
    };
    const [values, setValues] = useState(initialCompanyInfo);

    const handleChange = (name, value) => {
        setValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const resetForms = () => {
        salaryInputRef.current.reset();
        // for some reasons, company info refs were not working. IDK
        setValues({...initialCompanyInfo});
    }

    const calculateTaxableAmount = () => {

        if (!values['company']) {
            alert('Add a company name');
            return false;
        }

        const [basic, house, medical, conveyance, lfa, festival, others] = [
            basicRef,
            houseRef,
            medicalRef,
            conveyanceRef,
            lfaRef,
            festivalRef,
            otherTaxableRef
        ].map((i) => parseInt(i.current.value || 0, 10));

        if (!basic) {
            alert('Basic is zero. Add some data.');
            return;
        }

        // if it's given annually, multiplication should be done with months
        const multiplier = (values['calculationType'] === 'yearly') ? monthsRef.current.value : 1;
        // based on calculation type, max exempted amount
        const [houseMax, medicalMax, conveyanceMax] = [25000, 10000, 2500].map(i => i * multiplier);

        const amounts = {
            id: new Date().getTime(),
            name: values['company'],
            months: values['months'],
            festivals: values['festivals'],
            calculationType: values['calculationType'],
            basic: {
                actual: basic,
                exempted: 0,
                taxable: basic
            },
            house: {
                actual: house,
                exempted: houseMax > house ? house : houseMax,
                taxable: houseMax > house ? 0 : (house - houseMax),
            },
            medical: {
                actual: medical,
                exempted: medicalMax > medical ? medical : medicalMax,
                taxable: medicalMax > medical ? 0 : (medical - medicalMax),
            },
            conveyance: {
                actual: conveyance,
                exempted: conveyanceMax > conveyance ? conveyance : conveyanceMax,
                taxable: conveyanceMax > conveyance ? 0 : (conveyance - conveyanceMax),
            },
            lfa: {
                actual: lfa,
                exempted: lfa,
                taxable: 0,
            },
            festival: {
                actual: festival * (values['calculationType'] === 'yearly' ? 1 : parseInt(totalFestivalsRef.current.value)),
                exempted: 0,
                taxable: festival * (values['calculationType'] === 'yearly' ? 1 : parseInt(totalFestivalsRef.current.value)),
            },
            others: {
                actual: others,
                exempted: 0,
                taxable: others
            },
        }

        props.handleInputChange("companies", amounts);
        resetForms();
    }

    return <Row>
        <Col xs="12">
            {/*COMPANY INFORMATION FORM*/}
            <Form ref={companyInfoRef} onSubmit={e => e.preventDefault()}>
                <Form.Row>
                    <Form.Group className="col-3">
                        <Form.Control ref={companyNameRef} value={values['company']}
                                      onChange={(e) => handleChange('company', e.target.value.trim())}
                                      placeholder="Company name"/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <Form.Control type="number" min="0" value={values['months']} ref={monthsRef}
                                      onChange={(e) => handleChange('months', e.target.value)}
                                      placeholder="Months you've worked for"/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <Form.Control type="number" min="0" value={values['festivals']} ref={totalFestivalsRef}
                                      onChange={(e) => handleChange('festivals', e.target.value)}
                                      placeholder="No of Festivals"/>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <Form.Control as="select" ref={calculationTypeRef} value={values['calculationType']}
                                      onChange={(e) => handleChange('calculationType', e.target.value)}>
                            <option value="monthly">Calculate from Monthly</option>
                            <option value="yearly">Calculate from Yearly</option>
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
            </Form>
        </Col>

        {/* Salary Information */}
        <Col xs="12">
            <Form ref={salaryInputRef} onSubmit={e => {
                e.preventDefault();
                calculateTaxableAmount();
            }}>
                <Table size="sm">
                    <caption>
                        Earnings
                        {values['company'] ? ` at "${values['company']}"` : ''} -
                        [{values['months']} months] -
                        [{values['festivals']} festivals]
                    </caption>
                    <thead className="thead-dark">
                        <tr>
                            <th>As</th>
                            <th>Received (BDT.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Basic</td>
                            <td>
                                <Form.Control type="number" min="0" className="form-control-sm"
                                              ref={basicRef} placeholder="Basic pay"/>
                            </td>
                        </tr>
                        <tr>
                            <td>House rent</td>
                            <td>
                                <Form.Control type="number" min="0" className="form-control-sm"
                                              ref={houseRef} placeholder="House rent"/>
                            </td>
                        </tr>
                        <tr>
                            <td>Medical Allowance</td>
                            <td>
                                <Form.Control type="number" min="0" className="form-control-sm"
                                              ref={medicalRef} placeholder="Medical Allowance"/>
                            </td>
                        </tr>
                        <tr>
                            <td>Conveyance Allowance</td>
                            <td>
                                <Form.Control type="number" min="0" className="form-control-sm"
                                              ref={conveyanceRef} placeholder="Conveyance Allowance"/>
                            </td>
                        </tr>
                        <tr>
                            <td>Leave Fare Assistance</td>
                            <td>
                                <Form.Control type="number" min="0" ref={lfaRef} className="form-control-sm"
                                              placeholder="LFA"/>
                            </td>
                        </tr>
                        <tr>
                            <td>Festival Bonus</td>
                            <td>
                                <Form.Control type="number" min="0" className="form-control-sm"
                                              ref={festivalRef} placeholder="Festival Bonus"/>
                            </td>
                        </tr>
                        <tr>
                            <td>Other Taxable Bonus</td>
                            <td>
                                <Form.Control type="number" min="0" className="form-control-sm"
                                              ref={otherTaxableRef} placeholder="Other total Taxable Bonus"/>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                <Button onClick={resetForms} variant="warning" size="sm" className="float-left">
                    Reset above data
                </Button>
                <Button type="submit" size="sm" variant="primary" className="float-right">
                    Calculate {values['company'] ? 'for ' + values['company'] : ''}
                </Button>
            </Form>
        </Col>
    </Row>;
}