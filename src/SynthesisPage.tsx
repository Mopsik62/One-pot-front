import { FC } from "react";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getSynthesisSubstances } from "./modules/get-synthesis-substances.tsx";
import store from "./store/store";

import { Form, FormControl, FormGroup, Button, FormSelect, ListGroup, ListGroupItem, Modal } from "react-bootstrap";

import { setSynthesisSubstances } from "./modules/set-synthesis-substances.tsx";
import { editSynthesis } from "./modules/edit-synthesis.tsx";


import { getSynthesis } from "./modules/get-synthesis";
import { Syntheses } from "./modules/ds";

interface InputChangeInterface {
    target: HTMLInputElement;
}

const SynthesisPage: FC = () => {

    const newSubstanceInputRef = useRef<any>(null)
    const additionalConditionsRef = useRef<any>(null)
    const nameRef = useRef<any>(null)
    const statusRef = useRef<any>(null)



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
        var status = ''

        if (synthesis?.ID !== undefined) {
            synthesis_id = synthesis?.ID
        }
        if (additionalConditionsRef.current != null) {
            additional_conditions = additionalConditionsRef.current.value
        }
        if (nameRef.current != null) {
            name = nameRef.current.value
        }
        if (statusRef.current != null) {
            status = statusRef.current.value
        }

        const editResult = await editSynthesis(userToken, {
            ID: synthesis_id,
            Name: name,
            Additional_conditions: additional_conditions,
            Status: status,
        })
        console.log(editResult)


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
            <span>
            <input ref={newSubstanceInputRef} onChange={handleNewSubstanceChange}></input>
            <Button onClick={addSubstance}>Добавить</Button>
        </span>
            <h4>Характеристики:</h4>
            <Form>
                <FormGroup>
                    <label htmlFor="statusInput">Статус</label>
                    <FormSelect id="statusInput" defaultValue={synthesis?.Status} ref={statusRef}>
                        <option>Черновик</option>
                        <option>Удалён</option>
                        <option>Сформирован</option>
                        <option>Завершён</option>
                        <option>Отклонён</option>
                    </FormSelect>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="takeoffDate">Название</label>
                    <FormControl id="takeoffDate" defaultValue={synthesis?.Name} ref={nameRef}></FormControl>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="arrivalDate">Доп. условия</label>
                    <FormControl id="arrivalDate" defaultValue={synthesis?.Additional_conditions} ref={additionalConditionsRef}></FormControl>
                </FormGroup>

            </Form>
            <Button onClick={sendChanges}>Сохранить изменения</Button>
            <p></p>
            <Button href='/One-pot-front/syntheses'>К заказам</Button>
            <p></p>
            <Button href='/One-pot-front/'>Домой</Button>
            <p></p>
        </>
    )

}

export default SynthesisPage;