import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {useRef, useState} from "react";

export default function SalaryInformation(props) {
    const [companyNameRef, monthsRef, totalFestivalsRef, inputTypeRef] = [useRef(), useRef(), useRef(), useRef()];
    const [companyInfoRef, salaryInputRef] = [useRef(), useRef()];

    const [basicRef, houseRef, medicalRef, conveyanceRef] = [useRef(), useRef(), useRef(), useRef()];
    const [lfaRef, festivalRef, otherTaxableRef] = [useRef(), useRef(), useRef()];

    const initialCompanyInfo = {
        company: '',
        months: 12,
        festivals: 2,
        inputType: 'monthly'
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

    const calculateTaxableOf = (basic, percent, max, received) => {
        const atMax = percent ? Math.min(basic * percent, max) : max;
        return received > atMax ? received - atMax : 0;
    }

    const calculateMaxExemptionOf = (basic, percent, max, received) => {
        const atMax = percent ? Math.min(basic * percent, max) : max;
        return received > atMax ? atMax : received;
    }

    const calculateTaxableAmount = () => {

        if (!values['company']) {
            alert('Add a company name.');
            return false;
        }

        let festivalMultiplier = 1;
        let basicMultiplier = 1;
        if (values['inputType'] === 'monthly') {
            festivalMultiplier = values['festivals'];
            basicMultiplier = values['months'];
        }

        // already converted to yearly
        const [basic, house, medical, conveyance, lfa] = [
            basicRef,
            houseRef,
            medicalRef,
            conveyanceRef,
            lfaRef,
        ].map((i) => parseInt(i.current.value || 0, 10) * basicMultiplier);
        const festival = parseInt(festivalRef.current.value || 0, 10) * festivalMultiplier;
        const others = parseInt(otherTaxableRef.current.value || 0, 10);

        if (!basic) {
            alert('Basic salary is zero. Add some data.');
            return;
        }

        /**
         * As the payments are already converted to yearly,
         * Change the max values to yearly as well.
         */
        const [houseMax, medicalMax, conveyanceMax] = [25000, 10000, 2500].map(i => i * monthsRef.current.value);

        const amounts = {
            id: new Date().getTime(),
            name: values['company'],
            months: values['months'],
            festivals: values['festivals'],
            inputType: values['inputType'],
            basic: {
                yearly: basic,
                exempted: 0,
                taxable: basic,
            },
            house: {
                yearly: house,
                exempted: calculateMaxExemptionOf(basic, 0.5, houseMax, house),
                taxable: calculateTaxableOf(basic, 0.5, houseMax, house),
            },
            medical: {
                yearly: medical,
                exempted: calculateMaxExemptionOf(basic, 0.1, medicalMax, medical),
                taxable: calculateTaxableOf(basic, 0.1, medicalMax, medical),
            },
            conveyance: {
                yearly: conveyance,
                exempted: calculateMaxExemptionOf(basic, 0, conveyanceMax, conveyance),
                taxable: calculateTaxableOf(basic, 1, conveyanceMax, conveyance),
            },
            lfa: {
                yearly: lfa,
                exempted: lfa,
                taxable: 0,
            },
            festival: {
                yearly: festival,
                exempted: 0,
                taxable: festival,
            },
            others: {
                yearly: others,
                exempted: 0,
                taxable: others
            },
        }


        amounts['gross'] = amounts.festival.yearly + amounts.others.yearly +
            amounts.basic.yearly + amounts.house.yearly +
            amounts.medical.yearly + amounts.conveyance.yearly + amounts.lfa.yearly;

        amounts['net_exempted'] = amounts.festival.exempted + amounts.others.exempted +
            amounts.basic.exempted + amounts.house.exempted +
            amounts.medical.exempted + amounts.conveyance.exempted + amounts.lfa.exempted;

        amounts['net_taxable'] = amounts.festival.taxable + amounts.others.taxable +
            amounts.basic.taxable + amounts.house.taxable +
            amounts.medical.taxable + amounts.conveyance.taxable + amounts.lfa.taxable;

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
                        <Form.Text className="text-info">
                            Company name
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="col-3">
                        <Form.Control type="number" min="0" value={values['months']} ref={monthsRef}
                                      onChange={(e) => handleChange('months', e.target.value)}
                                      placeholder="Months you've worked for"/>
                        <Form.Text className="text-info">
                            Number of months
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="col-2">
                        <Form.Control type="number" min="0" value={values['festivals']} ref={totalFestivalsRef}
                                      onChange={(e) => handleChange('festivals', e.target.value)}
                                      placeholder="No of Festivals"/>
                        <Form.Text className="text-info">
                            Number of festivals
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="col-4">
                        <Form.Control as="select" ref={inputTypeRef} value={values['inputType']}
                                      onChange={(e) => handleChange('inputType', e.target.value)}>
                            <option value="monthly">Calculate from Monthly</option>
                            <option value="yearly">Calculate for specified months</option>
                        </Form.Control>
                        <Form.Text className="text-info">
                            Calculation type
                        </Form.Text>
                    </Form.Group>
                </Form.Row>
            </Form>
        </Col>
        {/* Salary Information */}
        <Col xs="12" style={{display: values['company'] ? 'block' : 'none'}}>
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