import { FC, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Button, Row, Col, Form, FormLabel, FormSelect} from 'react-bootstrap'

//import SynthesisCard from './components/SynthesisCard.tsx'
import store from './store/store'
import { getSyntheses } from './modules/get-syntheses.ts'
import { Syntheses } from './modules/ds'

//import { getSynthesisSubstances } from './modules/get-synthesis-substances.tsx'
import filtersSlice from './store/filtersSlice'
import { useAppDispatch } from "./store/store";
import { useRef } from "react";

import { deleteSynthesis } from './modules/delete-synthesis'
import { useNavigate } from 'react-router-dom'
import {modApproveSynthesis} from "./modules/mod-approve-synthesis.tsx";



const SynthesesPage: FC = () => {
    const { userToken, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
    const {synthesisStatus, startDate, endDate, synthesisCreator} = useSelector((state: ReturnType<typeof store.getState>) => state.filters)

    const [synthesesArray, setSynthesesArray] = useState<string[][]>([])
    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const statusRef = useRef<any>(null)
    const startDateRef = useRef<any>(null)
    const endDateRef = useRef<any>(null)
    const synthesisCreatorRef = useRef<any>(null)

    useEffect(() => {
        const applyFilters = () => {
            let status = statusRef.current.value
            let startDate = startDateRef.current.value
            let endDate = endDateRef.current.value
            let creator =
                userRole === "Moderator" ? synthesisCreatorRef.current.value : "";




            dispatch(filtersSlice.actions.setSynthesisStatus(status))
            dispatch(filtersSlice.actions.setStartDate(startDate))
            dispatch(filtersSlice.actions.setEndDate(endDate))
            dispatch(filtersSlice.actions.setSynthesisCreator(creator))

            if (status == "Все") {
                status = ""
            }
        }

        const loadSyntheses = async()  => {
            applyFilters()

            let status = statusRef.current.value
            let startDate = startDateRef.current.value
            let endDate = endDateRef.current.value
            let creator =
                userRole === "Moderator" ? synthesisCreatorRef.current.value : "";

            if (status == "Все") {
                status = ""
            }

            var syntheses: Syntheses[] = []

            if (userToken !== undefined) {

                if (synthesisStatus == null) { //todo
                    return;
                }

                syntheses = await getSyntheses(userToken?.toString(), status, startDate, endDate)
                 if (creator) {
                    syntheses = syntheses.filter((synthesis) => synthesis.User_name.startsWith(creator));
                 }
                console.log(synthesisCreator)

                if (!userToken) {
                    return
                }

                var arr: string[][] = []
                for (let synthesis of syntheses) {
                    // const all = await getSynthesisSubstances(synthesis.ID, userToken)
                    //
                    //     const substances = all.Substances
                    //     const substance_names = []
                    // if (all){
                    //     for (let substance of substances) {
                    //         substance_names.push(substance.Title)
                    //     }
                    // } else {
                    //     substance_names.push('')
                    // }


                    var synthesisArray:string[] = []
                    if (userRole?.toString() == 'Moderator') {
                        if (synthesis.User_name) {
                            synthesisArray.push(synthesis.User_name)
                        } else {
                            synthesisArray.push('Не удалось распознать пользователя')
                        }
                    }
                    synthesisArray.push(synthesis.ID.toString())
                    synthesisArray.push(synthesis.Status)
                    synthesisArray.push(synthesis.Name)
                   // synthesisArray.push(substance_names.toString().replace(new RegExp(',', 'g'), '\n'))

                    synthesisArray.push(synthesis.Additional_conditions)
                    if (synthesis.Date_created)
                    {
                        const originalDate = synthesis.Date_created.substring(0, 10)
                        const dateObject = new Date(originalDate);
                        const day = dateObject.getDate().toString().padStart(2, '0'); // День
                        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Месяц
                        const year = dateObject.getFullYear(); // Год
                        const formattedDate = `${day}-${month}-${year}`;
                        synthesisArray.push(formattedDate + " " + synthesis.Date_created.substring(11, 19))
                    }
                    if (synthesis.Date_processed)
                    {   if (synthesis.Date_processed == "0001-01-01T00:00:00Z") {
                        synthesisArray.push("-")
                    } else {
                        const originalDate = synthesis.Date_processed.substring(0, 10)
                        const dateObject = new Date(originalDate);
                        const day = dateObject.getDate().toString().padStart(2, '0'); // День
                        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Месяц
                        const year = dateObject.getFullYear(); // Год
                        const formattedDate = `${day}-${month}-${year}`;
                        synthesisArray.push(formattedDate + " " + synthesis.Date_processed.substring(11, 19))
                     }
                    }
                    if (synthesis.Date_finished)
                    {
                        if (synthesis.Date_finished == "0001-01-01T00:00:00Z") {
                            synthesisArray.push("-")
                        } else {
                            const originalDate = synthesis.Date_finished.substring(0, 10)
                            const dateObject = new Date(originalDate);
                            const day = dateObject.getDate().toString().padStart(2, '0'); // День
                            const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Месяц
                            const year = dateObject.getFullYear(); // Год
                            const formattedDate = `${day}-${month}-${year}`;
                            synthesisArray.push(formattedDate + " " + synthesis.Date_finished.substring(11, 19))
                        }
                    }
                    synthesisArray.push(synthesis.Time)
                   // console.log(synthesisArray)
                   // console.log("dsadsad")



                    arr.push(synthesisArray)
                }
                setSynthesesArray(arr);

            }
        }

        applyFilters()

        loadSyntheses()

        const intervalId = setInterval(() => {
            loadSyntheses();
        }, 1000);

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(intervalId);


    }, [synthesesArray])

    if (!userToken) {
        return (
            <>
                <h3> Для просмотра синтезов вам необходимо войти в систему!</h3>
            </>
        )
    }

    const cancelSynthesis = async(event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(event.currentTarget.id)
        const synthesis_id = parseInt(event.currentTarget.id, 10)
        if (!synthesis_id) {
            return
        }

        const result = await deleteSynthesis(userToken, synthesis_id)
        if (result.status == 200) {
            navigate('/One-pot-front/syntheses')
        }
    }

    const modConfirmTrue = async(synthesisID) => {
        if (!userToken) {
            return
        }
        await modApproveSynthesis(userToken, synthesisID, 'True')

    }


    const modConfirmFalse = async (synthesisID) => {
        if (!userToken) {
            return;
        }
     await modApproveSynthesis(userToken, synthesisID, "False");

    };


    return (
        <>
            <h1>Синтезы</h1>
            <Form>
                <Row>
                    <Col>
                        <FormLabel>Статус:</FormLabel>
                    </Col>
                    <Col>
                        <FormSelect ref={statusRef} defaultValue={synthesisStatus?.toString()}>
                            <option>Одобрен</option>
                            <option>Завершён</option>
                            <option>Отклонён</option>
                            <option>Сформирован</option>
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
            </Form>
            
            <Table>
                <thead className='thead-dark'>
                <tr>
                    {((userRole?.toString() == 'Moderator')) &&
                        <th scope='col'>Создатель</th>
                    }
                    <th scope='col'>ID</th>
                    <th scope='col'>Статус</th>
                    <th scope='col'>Название</th>
                    <th scope='col'>Доп. условия</th>
                    <th scope='col'>Дата создания</th>
                    <th scope='col'>Дата обработки</th>
                    <th scope='col'>Дата завершения</th>
                    <th scope='col'>Время синтеза</th>
                    <th scope='col'></th>
                    {(userRole?.toString() == 'User') &&
                        <th scope='col'></th>
                    }
                </tr>

                </thead>
                <tbody>
                {synthesesArray.map((rowContent, rowID) => (
                    <tr key={rowID}>

                        {rowContent.map((val, rowID) => (
                            <td key={rowID}>{val}</td>
                        ))
                        }
                            {((userRole?.toString() == 'Moderator') ) &&
                                <td>
                                    <div className="d-flex flex-column align-items-center">
                                        <Button
                                            href={synthesesArray[rowID][2] === 'Черновик' ?
                                                '/One-pot-front/synthesis_edit?synthesis_id=' + synthesesArray[rowID][1] :
                                                '/One-pot-front/synthesis?synthesis_id=' + synthesesArray[rowID][1]}
                                            className="mb-2 w-100"
                                        >
                                            Просмотр
                                        </Button>
                                        {synthesesArray[rowID][2] === 'Сформирован' &&
                                            <div className="d-flex">
                                                <Button
                                                    onClick={() => modConfirmFalse(synthesesArray[rowID][1])}
                                                    variant="danger"
                                                    className="mr-2"
                                                >
                                                    Отклонить
                                                </Button>
                                                <Button
                                                    onClick={() => modConfirmTrue(synthesesArray[rowID][1])}
                                                    variant="success"
                                                    className="ml-2"
                                                >
                                                    Одобрить
                                                </Button>
                                            </div>
                                        }
                                    </div>
                                </td>


                            }
                        {(userRole?.toString() == 'User') &&
                            <td>
                                <Button href={'/One-pot-front/synthesis?synthesis_id=' + synthesesArray[rowID][0]}>Просмотр</Button>
                            </td>
                        }
                        {(userRole?.toString() === 'User' && synthesesArray[rowID][1] === 'Черновик') &&
                            <td>
                                <Button variant='danger'
                                        id={synthesesArray[rowID][Number((userRole?.toString() === 'Moderator'))]}
                                        onClick={cancelSynthesis}>
                                    Отменить
                                </Button>
                            </td>
                        }
                    </tr>
                ))}

                </tbody>
            </Table>
        </>
    )
}

export default SynthesesPage