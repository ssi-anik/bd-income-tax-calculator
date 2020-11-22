import UserInformation from "./UserInformation";
import SalaryInformation from "./SalaryInformation";

export default function LeftSideContent(props) {
    return <div>
        <UserInformation handleInputChange={props.handleInputChange}/>
        <SalaryInformation handleInputChange={props.handleInputChange}/>
    </div>;
}