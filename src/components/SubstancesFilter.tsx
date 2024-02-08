import { FC} from "react";
import { FormLabel, Button, Row} from "react-bootstrap";
import { useSelector } from "react-redux";
import store from "../store/store";
import filtersSlice from "../store/filtersSlice";
import { useAppDispatch } from "../store/store";
import { useRef } from "react";




const SubstancesFilter: FC = () => {

    const dispatch = useAppDispatch()

    const {substanceName} = useSelector((state: ReturnType<typeof store.getState>) => state.filters)

    const nameRef = useRef<any>(null)



    const applyFilters = () => {
        let name = nameRef.current.value
        dispatch(filtersSlice.actions.setSubstanceName(name))


    }


    return (
        <div style={{border: '1px solid black'}}>
            <Row>
                <div className="col-2">
                    <FormLabel>Название:</FormLabel>
                </div>
                <div className="col-2">
                    <input ref={nameRef} defaultValue={substanceName?.toString()} className="form-control"></input>
                </div>
            </Row>
            <Button onClick={applyFilters}>Поиск</Button>
        </div>

    )
}

export default SubstancesFilter