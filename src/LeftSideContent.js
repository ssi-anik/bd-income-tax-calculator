import {Row} from "react-bootstrap";
import UserInformation from "./UserInformation";

export default function LeftSideContent(props) {
    return <div>
        <Row>
            <UserInformation handleInputChange={props.handleInputChange}/>
        </Row>
    </div>;
}