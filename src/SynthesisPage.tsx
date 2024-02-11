import { FC } from "react";

import { useEffect, useState, useRef} from "react";
import { useSelector } from "react-redux";

import { Col, Form,  Button,ListGroup, ListGroupItem,  FormLabel, Row } from "react-bootstrap";

import { getSynthesis } from "./modules/get-synthesis";
import { Syntheses } from "./modules/ds";
import { getSynthesisSubstances } from "./modules/get-synthesis-substances.tsx";
import { removeSubstanceFromSynthesis } from "./modules/remove-substance-from-synthesis.tsx";
import { approveSynthesis } from "./modules/approve-synthesis"
import { editSynthesis } from "./modules/edit-synthesis";

import { useNavigate } from "react-router-dom";

import store from "./store/store";
import cartSlice from './store/cartSlice'
import { useAppDispatch } from "./store/store";

import { order } from "./modules/order.tsx";
import { getSubstance } from "./modules/get-substance";

interface InputChangeInterface {
    target: HTMLInputElement;
}

const SynthesisPage: FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {userToken, userName, userRole} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const [synthesis, setSynthesis] = useState<Syntheses>()
    const [substancesNames, setSubstanceNames] = useState<string[]>()
    const [wrongSynthesis, setWrongSynthesis] = useState(false)

    const [newSubstance, setNewSubstance] = useState('')

    const newSubstanceInputRef = useRef<any>(null)
    const additionalConditionsRef = useRef<any>(null)
    const NameRef = useRef<any>(null)

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString)
        const synthesisIdString = urlParams.get('synthesis_id')

        if (!synthesisIdString || (synthesisIdString && !parseInt(synthesisIdString, 10))) {
            setWrongSynthesis(true)
        }

        const loadSynthesis = async () => {
            if (!synthesisIdString) {
                return
            }
            const synthesis = await getSynthesis(+synthesisIdString, userToken)
            setSynthesis(synthesis)
            console.log(synthesis)
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

    const approve =  async () => {
        if (!userToken || !synthesis?.ID) {
            return
        }


        const result = await approveSynthesis(userToken, synthesis?.ID)
        if (result.status == 200) {
            dispatch(cartSlice.actions.setAdditionalConditions(null))
            dispatch(cartSlice.actions.setDraftID(null))
            console.log("")
            navigate('/One-pot-front/syntheses')

        }
        let additionalConditions = additionalConditionsRef.current.value
        let name = NameRef.current.value


        if (!additionalConditions) {
            additionalConditions = ""
        }
        if (!name) {
            name = ""
        }


        await editSynthesis(userToken, synthesis?.ID, name, additionalConditions, synthesis?.Time)
    }

    const save =  async () => {
        if (!userToken || !synthesis?.ID) {
            return
        }

        let additionalConditions = additionalConditionsRef.current.value
        let name = NameRef.current.value


        if (!additionalConditions) {
            additionalConditions = ""
        }
        if (!name) {
            name = ""
        }

        await editSynthesis(userToken, synthesis?.ID, name, additionalConditions, synthesis?.Time)
    }

    const removeSubstance = async(event: React.MouseEvent<HTMLButtonElement>) => {
        let removedSubstanceName = event.currentTarget.id

        if (!substancesNames || !userToken || !synthesis?.ID) {
            return
        }

        let result = await getSubstance(removedSubstanceName)
        if (!result.Title) {
            return
        }

        let deletion_result = await removeSubstanceFromSynthesis(userToken, result.ID, synthesis?.ID)
        if (deletion_result.status != 201) {
            return


        }


        setSubstanceNames(substancesNames.filter(function(substanceName) {
            return substanceName !== removedSubstanceName
        }))
    }

    const handleNewSubstanceChange = (event: InputChangeInterface) => {
        setNewSubstance(event.target.value)
    }

    const addSubstance = async () => {
        if (!newSubstance || !userToken) {
            return
        }

        if (substancesNames?.indexOf(newSubstance) !== -1) {
            return
        }

        const result = await getSubstance(newSubstance)
        if (!result.Title) {
            return
        }

        const addition_result = await order(result.Title, userToken, "", "Черновик");
        if (addition_result.status != 200) {
            return
        }


        if (!substancesNames) {
            setSubstanceNames([newSubstance.toString()]);
        }

        if (substancesNames === undefined) {
            return;
        }

        setSubstanceNames(substancesNames.concat([newSubstance]))
        setNewSubstance('')

        if (newSubstanceInputRef.current != null) {
            newSubstanceInputRef.current.value = ""
        }
    }

        if (wrongSynthesis) {
            return (
                <h1>Синтез не существует!</h1>
            )
        }

    return(
        <Form style={{width: '600px', marginRight: 'auto', marginLeft: 'auto'}}>
            <h1>Просмотр синтеза #{synthesis?.ID}</h1>
            <h4>Субстанции:</h4>
            {(synthesis?.Status == "Черновик" && (synthesis.User_name == userName || userRole == "Moderator")) &&
                <>
                    <ListGroup style={{width: '500px'}}>
                        {substancesNames?.map((substanceName, substanceID) => (
                            <ListGroupItem key={substanceID}> {substanceName}
                                <span className="pull-right button-group" style={{float: 'right'}}>
                                    <Button variant="danger" id={substanceName} onClick={removeSubstance}>Удалить</Button>
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
                </>
            }
            {

            }
            {!((synthesis?.Status == "Черновик" && (synthesis.User_name == userName || userRole == "Moderator"))) &&
                <ListGroup style={{width: '500px'}}>
                    {substancesNames?.map((substanceName, substanceID) => (
                        <ListGroupItem key={substanceID}> {substanceName}
                        </ListGroupItem>
                    ))
                    }
                </ListGroup>
            }
            <h4>Характеристики:</h4>

            <p></p>
            <FormLabel>Статус: {synthesis?.Status}</FormLabel>
            <p></p>
            <FormLabel>Время: {synthesis?.Time}</FormLabel>
            <p></p>


            {(synthesis?.Status == "Черновик" && (synthesis.User_name == userName || userRole == "Moderator")) &&
                <>
                    <FormLabel>Доп условия:</FormLabel>
                    <input
                        className="form-control"
                        ref={additionalConditionsRef}
                        defaultValue={synthesis.Additional_conditions}

                    />
                </>
            }
            {!(synthesis?.Status == "Черновик" && (synthesis.User_name == userName || userRole == "Moderator")) &&
                <>
                    <FormLabel>Доп условия: {synthesis?.Additional_conditions}</FormLabel>
                </>
            }
            <p></p>
            {(synthesis?.Status == "Черновик" && (synthesis.User_name == userName || userRole == "Moderator")) &&
                <>
                    <FormLabel>Название:</FormLabel>
                    <input
                        className="form-control"
                        ref={NameRef}
                        defaultValue={synthesis.Name}
                    />
                </>
            }
            {!(synthesis?.Status == "Черновик" && (synthesis.User_name == userName || userRole == "Moderator")) &&
                <>
                    <FormLabel>Название: {synthesis?.Name}</FormLabel>
                </>
            }

            {(synthesis?.Status == "Черновик" && synthesis.User_name == userName) &&
                <Row>
                    <p></p>
                    <Button onClick={approve} variant="success">Сформировать</Button>
                </Row>
            }
            <p></p>
                {(synthesis?.Status == "Черновик" && synthesis.User_name == userName) &&
                    <Row>
                        <Button onClick={save} variant="success">Сохранить </Button>
                    </Row>
                }
            <p></p>
            <Row>
                <Button href='/One-pot-front/'>Домой</Button>
            </Row>
            <p></p>
        </Form>


    )

}

export default SynthesisPage;