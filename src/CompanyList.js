import {Col, Row} from "react-bootstrap";
import SalaryBreakdown from "./Company";

export default function CompanyList(props) {
    const companies = props.companies;

    return <Row style = {{marginTop: 5}}>
        <Col xs="12">
            {
                companies.map(company => <SalaryBreakdown key = {company.id} company={company}/>)
            }
        </Col>
    </Row>;
}