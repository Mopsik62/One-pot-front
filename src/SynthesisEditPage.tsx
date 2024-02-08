import { FC } from "react";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getSynthesisSubstances } from "./modules/get-synthesis-substances.tsx";
import store from "./store/store";
import { useNavigate } from "react-router-dom";
import { modApproveSynthesis } from "./modules/mod-approve-synthesis"

import { Container, Form, FormControl,  FormGroup, Button,ListGroup, ListGroupItem, Modal, Row, Col, FormLabel } from "react-bootstrap";

import { setSynthesisSubstances } from "./modules/set-synthesis-substances.tsx";
import { editSynthesis } from "./modules/edit-synthesis.tsx";


import { getSynthesis } from "./modules/get-synthesis";
import { Syntheses } from "./modules/ds";

interface InputChangeInterface {
    target: HTMLInputElement;
}

const SynthesisEditPage: FC = () => {
    const navigate = useNavigate()

    const newSubstanceInputRef = useRef<any>(null)
    const additionalConditionsRef = useRef<any>(null)
    const TimeRef = useRef<any>(null)
    const nameRef = useRef<any>(null)



    const {userToken} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const [synthesis , setSynthesis] = useState<Syntheses>()

    const [substanceNames, setSubstanceNames] = useState<string[]>()
    const [newSubstance, setNewSubstance] = useState('')

    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString)
        const synthesisIdString = urlParams.get('synthesis_id')

        const loadSynthesis = async () => {
            if (synthesisIdString === null) {
                return
            }
            console.log(synthesisIdString)
            const synthesis = await getSynthesis(+synthesisIdString, userToken)
            setSynthesis(synthesis)

            if (userToken === null) {
                return
            }

            const substances = await getSynthesisSubstances(+synthesisIdString, userToken)
            var substanceNames: string[] = []
            if (substances)
            { for (let substance of substances.Substances) {
                substanceNames.push(substance.Title)
            }
                setSubstanceNames(substanceNames)}

        }

        loadSynthesis()


    }, [])

    const sendChanges = async() => {
        if (!userToken) {
            return;
        }

        var synthesis_id = 0
        var name = ''
        var additional_conditions = ''
        var time =''

        if (synthesis?.ID !== undefined) {
            synthesis_id = synthesis?.ID
        }
        if (additionalConditionsRef.current != null) {
            additional_conditions = additionalConditionsRef.current.value
        }
        if (TimeRef.current != null) {
            time = TimeRef.current.value
        }
        if (nameRef.current != null) {
            name = nameRef.current.value
        }

        await editSynthesis(userToken, synthesis_id, name, additional_conditions, time)



        if (!substanceNames || !userToken) {
            return;
        }
        const substancesResult = await setSynthesisSubstances(synthesis?.ID, substanceNames, userToken)
        if (substancesResult.status == 201) {
            setShowSuccess(true)
        } else {
            setShowError(true)
        }

    }

    const modConfirmTrue = async() => {
        if (!userToken || !synthesis?.ID) {
            return
        }

        const result = await modApproveSynthesis(userToken, synthesis?.ID, 'True')
        if (result.status == 200) {
            navigate('/One-pot-front/syntheses')
        }
    }

    const modConfirmEnd = async() => {
        if (!userToken || !synthesis?.ID) {
            return
        }

        const result = await modApproveSynthesis(userToken, synthesis?.ID, 'End')
        if (result.status == 200) {
            navigate('/One-pot-front/syntheses')
        }
    }

    const modConfirmFalse = async() => {
        if (!userToken || !synthesis?.ID) {
            return
        }

        const result = await modApproveSynthesis(userToken, synthesis?.ID, 'False')
        if (result.status == 200) {
            navigate('/One-pot-front/syntheses')
        }
    }


    const removeSubstance = (removedSubstanceName: string) => {
        return (event: React.MouseEvent) => {
            if (!substanceNames) {
                return
            }

            setSubstanceNames(substanceNames.filter(function(substanceName) {
                return substanceName !== removedSubstanceName
            }))

            event.preventDefault()
        }
    }

    const addSubstance = () => {
        if (!newSubstance) {
            return
        }

        if (!substanceNames) {
            setSubstanceNames([newSubstance.toString()]);
        }

        if (substanceNames === undefined) {
            return;
        }


        setSubstanceNames(substanceNames.concat([newSubstance]))
        setNewSubstance('')

        if (newSubstanceInputRef.current != null) {
            newSubstanceInputRef.current.value = ""
        }
    }

    const handleNewSubstanceChange = (event: InputChangeInterface) => {
        setNewSubstance(event.target.value)
    }

    const handleErrorClose= () => {
        setShowError(false)
    }
    const handleSuccessClose = () => {
        setShowSuccess(false)
    }

    return(
        <>
            <Modal show = {showError} onHide={handleErrorClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Произошла ошибка, синтезис не был обновлён</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleErrorClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show = {showSuccess} onHide={handleSuccessClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Обновление синтезиса прошло успешно!</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSuccessClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <Form style={{width: '600px', marginLeft: 'auto', marginRight: 'auto'}}>
                <h1>Редактирование синтеза #{synthesis?.ID}</h1>
                <h4>Субстанции:</h4>
                <ListGroup style={{width: '500px'}}>
                    {substanceNames?.map((substanceName, substanceID) => (
                        <ListGroupItem key={substanceID}> {substanceName}
                            <span className="pull-right button-group" style={{float: 'right'}}>
                        <Button variant="danger" onClick={removeSubstance(substanceName)}>Удалить</Button>
                    </span>
                        </ListGroupItem>
                    ))
                    }
                </ListGroup>
                <Row>
                    <Col>
                        <FormLabel>Добавить субстанцию:</FormLabel>
                    </Col>
                    <Col>
                        <input ref={newSubstanceInputRef} onChange={handleNewSubstanceChange} className="form-control"></input>
                    </Col>
                    <Col>
                        <Button onClick={addSubstance}>Добавить</Button>
                    </Col>
                </Row>
                <h4>Характеристики:</h4>

                <FormGroup>
                    <FormLabel>Статус: {synthesis?.Status}</FormLabel>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="Name">Название</label>
                    <FormControl id="Name" defaultValue={synthesis?.Name} ref={nameRef}></FormControl>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="Conditions">Доп. условия</label>
                    <FormControl id="Conditions" defaultValue={synthesis?.Additional_conditions} ref={additionalConditionsRef}></FormControl>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="Time">Время синтеза</label>
                    <FormControl id="Time" defaultValue={synthesis?.Time} ref={TimeRef}></FormControl>
                </FormGroup>
                <Row>
                    <Button onClick={sendChanges}>Сохранить изменения</Button>
                </Row>
                <p></p>
                <Container>
                    <Row>
                        <Col>
                            <Button onClick={modConfirmFalse} variant="danger" className="w-100">Отклонить</Button>
                        </Col>
                        <Col>
                            {((synthesis?.Status == "Сформирован")) &&

                                    <Button onClick={modConfirmTrue} variant="success" className="w-100">Одобрить</Button>

                            }
                            {((synthesis?.Status == "В работе")) &&

                                <Button onClick={modConfirmEnd} variant="success" className="w-100">Завершить</Button>

                            }
                        </Col>
                    </Row>
                </Container>
                <p></p>
                <Row>
                </Row>
                <p></p>
                <Row>
                    <Button href='/One-pot-front/syntheses'>Синтезы</Button>
                </Row>
                <p></p>
                <Row>
                    <Button href='/One-pot-front/'>Домой</Button>
                </Row>
                <p></p>
            </Form>

        </>
    )

}

export default SynthesisEditPage;