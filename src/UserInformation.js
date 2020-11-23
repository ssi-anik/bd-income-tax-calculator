import {useRef, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";

export default function UserInformation(props) {
    const {handleInputChange} = props;

    const [values, setValues] = useState({
        privilege: 'male',
        ageGroup: 'below',
        lowerBound: 300000,
        minimumTax: 5000,
    });

    const privilegeRef = useRef();
    const ageGroupRef = useRef();
    const minimumTaxRef = useRef();

    function calculateLowerBound() {
        const [privilege, ageGroup] = [privilegeRef.current.value, ageGroupRef.current.value];

        if (privilege === 'specially-abled') {
            return 450000;
        } else if (privilege === 'freedom-fighter') {
            return 475000;
        } else if (privilege === 'female' || ageGroup === 'above') {
            return 350000;
        }

        return 300000;
    }

    const handleChange = (field, value) => {
        setValues(prevState => ({
            ...prevState,
            [field]: value
        }));

        handleInputChange('lowerBound', calculateLowerBound());
        handleInputChange('minimumTax', parseInt(minimumTaxRef.current.value || 0));
    }


    return <Row>
        <Col xs="12">
            <form onSubmit={(e) => e.preventDefault()}>
                <Form.Row>
                    <Form.Group className="col-4">
                        <Form.Control as="select" value={values['privilege']}
                                      ref={privilegeRef}
                                      onChange={() => handleChange('privilege', privilegeRef.current.value)}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="specially-abled">Specially-abled</option>
                            <option value="freedom-fighter">Gazetted freedom fighter</option>
                        </Form.Control>
                        <Form.Text className="text-info">
                            Gender/Privilege
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="col-4">
                        <Form.Control as="select" value={values['ageGroup']}
                                      ref={ageGroupRef}
                                      onChange={() => handleChange('ageGroup', ageGroupRef.current.value)}>
                            <option value="below">Below or 65</option>
                            <option value="above">Above 65</option>
                        </Form.Control>
                        <Form.Text className="text-info">
                            Age group
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="col-4">
                        <Form.Control defaultValue={values['minimumTax']}
                                      onChange={() => handleChange('minimumTax', minimumTaxRef.current.value)}
                                      type="number" ref={minimumTaxRef} min="0"
                                      placeholder="Minimum tax in your area"/>

                        <Form.Text className="text-info">
                            Minimum tax in your area
                        </Form.Text>
                    </Form.Group>
                </Form.Row>
            </form>
        </Col>
    </Row>;
}