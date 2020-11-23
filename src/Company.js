import {Button, Table} from "react-bootstrap";

export default function Company(props) {
    const company = props.company;

    const removeCompany = (id, name) => {
        if (window.confirm(`Remove ${name} from the list?`)) {
            props.removeCompany(id);
        }
    }

    return <Table size="sm" style={{paddingTop: 5, borderTop: '#000 2px solid'}}>
        <thead>
            <tr>
                <th>As (in {company.name})</th>
                <th>Received Income (BDT.)</th>
                <th>Max exempted Income (BDT.)</th>
                <th>Net Taxable Amount (BDT.)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Basic</td>
                <td>{company.basic.yearly}</td>
                <td>{company.basic.exempted}</td>
                <td>{company.basic.taxable}</td>
            </tr>
            <tr>
                <td>House rent</td>
                <td>{company.house.yearly}</td>
                <td>{company.house.exempted}</td>
                <td>{company.house.taxable}</td>
            </tr>
            <tr>
                <td>Medical Allowance</td>
                <td>{company.medical.yearly}</td>
                <td>{company.medical.exempted}</td>
                <td>{company.medical.taxable}</td>
            </tr>
            <tr>
                <td>Conveyance Allowance</td>
                <td>{company.conveyance.yearly}</td>
                <td>{company.conveyance.exempted}</td>
                <td>{company.conveyance.taxable}</td>
            </tr>
            <tr>
                <td>Leave Fare Assistance</td>
                <td>{company.lfa.yearly}</td>
                <td>{company.lfa.exempted}</td>
                <td>{company.lfa.taxable}</td>
            </tr>
            <tr>
                <td>Festival Bonus</td>
                <td>{company.festival.yearly}</td>
                <td>{company.festival.exempted}</td>
                <td>{company.festival.taxable}</td>
            </tr>
            <tr>
                <td>Others</td>
                <td>{company.others.yearly}</td>
                <td>{company.others.exempted}</td>
                <td>{company.others.taxable}</td>
            </tr>
            <tr>
                <td><b>TOTAL</b></td>
                <td><b>{company.gross}</b></td>
                <td><b>{company.net_exempted}</b></td>
                <td><b>{company.net_taxable}</b></td>
            </tr>
            <tr>
                <td colSpan="4" className="text-right">
                    <Button onClick={() => removeCompany(company.id, company.name)} size="sm" variant="danger" block>
                        Remove [{company.name}'s earnings -
                        {` ${company.months}`} months -
                        {` ${company.festivals}`} festivals] from this list
                    </Button>
                </td>
            </tr>
        </tbody>
    </Table>;
}