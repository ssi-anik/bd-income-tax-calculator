import UserInformation from "./UserInformation";
import SalaryInformation from "./SalaryInformation";
import CompanyList from "./CompanyList";

export default function LeftSideContent(props) {
    return <div>
        <UserInformation handleInputChange={props.handleInputChange}/>
        <SalaryInformation handleInputChange={props.handleInputChange}/>
        <CompanyList companies={props.companies} removeCompany = {props.removeCompany}/>
    </div>;
}