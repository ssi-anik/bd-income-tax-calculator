import {Col, Form, Row, Table} from "react-bootstrap";
import {useRef, useState} from "react";

export default function RightSideContent(props) {
    const {minimumTax, lowerBound, companies} = props.values;

    const [aitRef, investmentRef] = [useRef(), useRef()];

    const [values, setValues] = useState({
        ait: 0,
        investment: 0,
    });


    const handleChange = (name, value) => {
        value = parseInt(value || 0, 10);

        setValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const totalTaxableAmount = () => {
        return companies.reduce((p, c) => p + c.net_taxable, 0);
    }

    const investmentSlabs = (taxableIncome) => {
        const slabs = [];
        if (taxableIncome > 3000000) {
            slabs.push([.15, 250000]);
            slabs.push([.12, 500000]);
            slabs.push([.1]);
        } else if (taxableIncome > 1000000) {
            slabs.push([.15, 250000]);
            slabs.push([.12]);
        } else {
            slabs.push([.15]);
        }

        return slabs;
    }

    const maxAllowedInvestment = () => {
        return Math.min(.25 * totalTaxableAmount(), 15000000, values['investment']); // max can be 15Lacs
    }

    const maxInvestmentRebate = () => {
        if (!values['investment']) {
            return 0;
        }

        const taxableIncome = totalTaxableAmount();
        if (!taxableIncome) {
            return 0;
        }

        const slabs = investmentSlabs(taxableIncome);
        let rebate = 0;
        let investment = maxAllowedInvestment();

        for (let i = 0; i < slabs.length; ++i) {
            let percent = slabs[i][0];
            let upperBound = slabs[i][1] ?? investment;
            console.log(percent, upperBound, investment);
            if (upperBound > investment) {
                upperBound = investment;
                investment = 0;
            } else {
                investment -= upperBound;
            }

            rebate = rebate + upperBound * percent;
            if (investment === 0) {
                break;
            }
        }

        return rebate;
    }

    const rebate = maxInvestmentRebate();

    const netTaxableAmount = totalTaxableAmount();

    const maxInvestment = maxAllowedInvestment();

    return <Row>
        <Col xs="12">
            <Form.Group>
                <Form.Control type="number" min="0" className="form-control-sm"
                              onChange={() => handleChange('ait', aitRef.current.value)}
                              value={values['ait']} ref={aitRef} placeholder="Processed AIT by Company"/>
                <Form.Text className="text-info">
                    Advance Income Tax [Deducted by Company]
                </Form.Text>
            </Form.Group>

            <Form.Group>
                <Form.Control type="number" min="0" className="form-control-sm"
                              onChange={() => handleChange('investment', investmentRef.current.value)}
                              value={values['investment']} ref={investmentRef}
                              placeholder="Total allowable Investment"/>
                <Form.Text className="text-info">
                    Allowable total investment
                </Form.Text>
            </Form.Group>

            <Table size="sm">
                <tbody>
                    <tr>
                        <td>Minimum tax</td>
                        <td><b>{minimumTax}</b></td>
                    </tr>
                    <tr>
                        <td>Minimum taxable income</td>
                        <td><b>{lowerBound}</b></td>
                    </tr>
                    <tr>
                        <td>AIT</td>
                        <td><b>{values['ait']}</b></td>
                    </tr>
                    <tr>
                        <td>Total investment</td>
                        <td><b>{values['investment']}</b></td>
                    </tr>
                    <tr>
                        <td>Max allowed investment</td>
                        <td><b>{maxInvestment}</b></td>
                    </tr>
                    <tr>
                        <td>Total taxable income</td>
                        <td><b>{netTaxableAmount}</b></td>
                    </tr>
                    <tr>
                        <td>Rebate from investment</td>
                        <td><b>{rebate}</b></td>
                    </tr>
                </tbody>
            </Table>
        </Col>
    </Row>;
}