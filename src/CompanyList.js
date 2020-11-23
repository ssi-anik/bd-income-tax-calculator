import {Col, Row} from "react-bootstrap";
import SalaryBreakdown from "./Company";

export default function CompanyList(props) {
    const companies = props.companies;

    return <Row style={{marginTop: 5}}>
        <Col xs="12" className="table-responsive">
            {
                companies.map(company => {
                    return <SalaryBreakdown removeCompany={props.removeCompany}
                                            key={company.id}
                                            company={company}/>
                })
            }
        </Col>
    </Row>;
}