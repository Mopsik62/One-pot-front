import { FC,  useState, useEffect } from "react";
import { FormLabel, Form, Button, Row, Col} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import store from "../store/store";
import filtersSlice from "../store/filtersSlice";
import { useAppDispatch } from "../store/store";

interface InputChangeInterface {
    target: HTMLInputElement;
}


const SubstancesFilter: FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {substanceName} = useSelector((state: ReturnType<typeof store.getState>) => state.filters)


    const [name, setName] = useState('')

    useEffect(() => {
        console.log('Filters page got substanceName: ' + substanceName)
    }, [])

    const applyFilters = () => {
        dispatch(filtersSlice.actions.setSubstanceName(name))

        let filterString = '?name_pattern=' + name

        navigate('/One-pot-front/' + filterString)
        window.location.reload()
    }

    const handleNameChange = (event: InputChangeInterface) => {
        setName(event.target.value)
        console.log(event.target.value)
    }

    return (
        <div style={{border: '1px solid black'}}>
            <Row>
                <Col>
                    <Form>
                        <FormLabel>Имя:</FormLabel>
                        <input onChange={handleNameChange} defaultValue={substanceName?.toString()}></input>
                    </Form>
                </Col>
            </Row>
            <Button onClick={applyFilters}>Поиск</Button>
        </div>

    )
}

export default SubstancesFilter