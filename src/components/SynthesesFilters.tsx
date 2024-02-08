import { FC } from "react";
import { useSelector } from "react-redux";
import { Form, FormLabel, FormSelect, Row, Col, Button } from "react-bootstrap";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import store from "../store/store";
import filtersSlice from "../store/filtersSlice";
import { useAppDispatch } from "../store/store";

const SynthesesFilter: FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const statusRef = useRef<any>(null)
    const startDateRef = useRef<any>(null)
    const endDateRef = useRef<any>(null)
    const synthesisCreatorRef = useRef<any>(null)


    const {synthesisStatus, startDate, endDate, synthesisCreator} = useSelector((state: ReturnType<typeof store.getState>) => state.filters)
    const {userRole} = useSelector(
        (state: ReturnType<typeof store.getState> ) => state.auth
    )

    const applyFilters = () => {
        let status = statusRef.current.value
        let startDate = startDateRef.current.value
        let endDate = endDateRef.current.value
        let synthesisCreator = synthesisCreatorRef.current.value
        // if (startDate) {
        //     startDate += ':00Z';
        // }
        //
        // if (endDate) {
        //     endDate += ':00Z'
        // }
        console.log(startDate)
        dispatch(filtersSlice.actions.setSynthesisStatus(status))
        dispatch(filtersSlice.actions.setStartDate(startDate))
        dispatch(filtersSlice.actions.setEndDate(endDate))
        dispatch(filtersSlice.actions.setSynthesisCreator(synthesisCreator))


        if (status == "Все") {
            status = ""
        }

        //2024-02-01T15:25:00Z
        let url = '/One-pot-front/syntheses?status=' + status;
        url += '&date1=' + startDate + '&date2=' + endDate + '&creator=' + synthesisCreator

        navigate(url)
        window.location.reload()
    }

    return (
        <div style={{border: '1px solid black'}}>
            <Form>
                <Row>
                    <Col>
                        <FormLabel>Статус:</FormLabel>
                    </Col>
                    <Col>
                        <FormSelect ref={statusRef} defaultValue={synthesisStatus?.toString()}>
                            <option>В работе</option>
                            <option>Завершён</option>
                            <option>Отклонён</option>
                            <option>Все</option>
                        </FormSelect>
                    </Col>
                    {userRole?.toString() == 'Moderator' &&
                        <>
                            <Col>
                                <FormLabel>Создатель:</FormLabel>
                            </Col>
                            <Col>
                                <input
                                    defaultValue={synthesisCreator?.toString()}
                                    ref={synthesisCreatorRef}
                                />
                            </Col>
                        </>
                    }
                    <Col>
                        <FormLabel>Создана с:</FormLabel>
                    </Col>
                    <Col>
                        <input
                            type="date"
                            defaultValue={startDate?.toString()}
                            ref={startDateRef}
                        />
                    </Col>
                    <Col>
                        <FormLabel>По:</FormLabel>
                    </Col>
                    <Col>
                        <FormLabel></FormLabel>
                        <input
                            type="date"
                            defaultValue={endDate?.toString()}
                            ref={endDateRef}
                        />
                    </Col>
                </Row>
                <Button onClick={applyFilters}>Поиск</Button>
            </Form>
        </div>
    )
}

export default SynthesesFilter