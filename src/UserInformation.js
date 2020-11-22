import {useRef, useState} from "react";

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
        handleInputChange('minimumTax', minimumTaxRef.current.value);
    }


    return <div className="col-12">
        <form>
            <div className="form-row">
                <div className="form-group col-4">
                    <select className="form-control" value={values['privilege']}
                            ref={privilegeRef}
                            onChange={() => handleChange('privilege', privilegeRef.current.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="specially-abled">Specially-abled</option>
                        <option value="freedom-fighter">Gazetted freedom fighter</option>
                    </select>
                </div>
                <div className="form-group col-4">
                    <select value={values['ageGroup']}
                            ref={ageGroupRef}
                            onChange={() => handleChange('ageGroup', ageGroupRef.current.value)}
                            className="form-control">
                        <option value="below">Below or 65</option>
                        <option value="above">Above 65</option>
                    </select>
                </div>
                <div className="form-group col-4">
                    <input defaultValue={values['minimumTax']}
                           onChange={() => handleChange('minimumTax', minimumTaxRef.current.value)}
                           type="number" ref={minimumTaxRef} className="form-control" min="0"
                           placeholder="Minimum tax in your area"/>
                </div>
            </div>
        </form>
    </div>;
}