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
        return Math.min(.25 * totalTaxableAmount(), 15000000, values['investment']); // max can be 1.5Crore
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

    const taxBreakdown = () => {
        let breakdown = {
            gross: 0,
            slabs: [
                {
                    next: lowerBound,
                    text: 'From 0 to ' + lowerBound,
                    as: '0%',
                    percent: 0,
                    remains: 0,
                    tax: 0,
                }, {
                    next: 100000,
                    text: 'For remaining next ' + 100000,
                    as: '5%',
                    percent: 0.05,
                    remains: 0,
                    tax: 0,
                }, {
                    next: 300000,
                    text: 'For remaining next 300000',
                    as: '10%',
                    percent: 0.1,
                    remains: 0,
                    tax: 0,
                }, {
                    next: 400000,
                    text: 'For remaining next 400000',
                    as: '15%',
                    percent: 0.15,
                    remains: 0,
                    tax: 0,
                }, {
                    next: 500000,
                    text: 'For remaining next ' + 500000,
                    as: '20%',
                    percent: 0.2,
                    remains: 0,
                    tax: 0,
                }, {
                    next: undefined,
                    text: 'For remaining everything else',
                    as: '25%',
                    percent: 0.25,
                    remains: 0,
                    tax: 0,
                }
            ]
        };

        let gross = 0, taxable = totalTaxableAmount();
        if (!taxable) {
            return breakdown;
        }

        if (taxable < lowerBound) {
            return breakdown;
        }

        for (let i = 0; i < breakdown['slabs'].length; ++i) {
            // get the current slab
            let current = breakdown['slabs'][i];
            // get the upper bound of this slab
            let limit = current['next'];
            // if no upper bound is defined, then remaining taxable is the upper bound
            if (limit === undefined) {
                limit = taxable;
            }

            // taxable reached the maximum limit
            if (taxable <= limit) {
                limit = taxable;
                taxable = 0;
            } else {
                taxable -= limit;
            }

            let thisSlab = current['percent'] * limit;
            breakdown['slabs'][i].tax = thisSlab;
            breakdown['slabs'][i].remains = taxable;
            gross += thisSlab;
        }

        breakdown.gross = gross && gross < minimumTax ? minimumTax : gross;

        return breakdown;
    }

    const rebate = maxInvestmentRebate();

    const netTaxableAmount = totalTaxableAmount();

    const maxInvestment = maxAllowedInvestment();

    const breakdown = taxBreakdown();

    let finalLiability = breakdown['gross'] - (breakdown['gross'] ? rebate : 0) - (breakdown['gross'] ? values['ait'] : 0);
    if (finalLiability < 0) {
        finalLiability = 0;
    }

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
            <hr/>
            <p className='text-secondary text-center'>Tax breakdown</p>
            <div className="table-responsive">
                <Table size="sm">
                    <thead>
                        <tr>
                            <th>Total Income</th>
                            <th>Percentage</th>
                            <th>Calculated Tax</th>
                            <th>Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            breakdown.slabs.map((slab, k) => {
                                return <tr key={k}>
                                    <td>{slab.text}</td>
                                    <td className="text-center">{slab.as}</td>
                                    <td className="text-right">{slab.tax}</td>
                                    <td className="text-right">{slab.remains}</td>
                                </tr>
                            })
                        }
                        <tr>
                            <td><b>Minimum/Gross Tax</b></td>
                            <td></td>
                            <td className="text-right">
                                <b>{breakdown['gross']}</b>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><b>Investment rebate</b></td>
                            <td></td>
                            <td className="text-right">
                                <b> - {breakdown['gross'] ? rebate : 0}</b>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><b>AIT deduction</b></td>
                            <td></td>
                            <td className="text-right">
                                <b> - {values['ait']}</b>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><b>Net Tax liability</b></td>
                            <td></td>
                            <td className="text-right">
                                <b> = {finalLiability}</b>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Col>
    </Row>;
}