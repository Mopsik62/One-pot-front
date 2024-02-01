import { FC } from "react";

import { useEffect, useState} from "react";
import { useSelector } from "react-redux";

import { Form,  Button,ListGroup, ListGroupItem,  FormLabel } from "react-bootstrap";

import { getSynthesis } from "./modules/get-synthesis";
import { Syntheses } from "./modules/ds";
import { getSynthesisSubstances } from "./modules/get-synthesis-substances.tsx";
import store from "./store/store";
const SynthesisPage: FC = () => {

    const {userToken} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const [synthesis, setSynthesis] = useState<Syntheses>()
    const [substancesNames, setSubstanceNames] = useState<string[]>()

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

    return(
        <div style={{width: '600px'}}>
            <h1>Просмотр синтеза #{synthesis?.ID}</h1>
            <h4>Субстанции:</h4>
            <ListGroup style={{width: '500px'}}>
                {substancesNames?.map((regionName, regionID) => (
                    <ListGroupItem key={regionID}> {regionName}
                    </ListGroupItem>
                ))
                }
            </ListGroup>
            <h4>Характеристики:</h4>
            <Form>
                <FormLabel>Статус: {synthesis?.Status}</FormLabel>
                <br />
                <FormLabel>Название: {synthesis?.Name}</FormLabel>
                <br />
                <FormLabel>Доп условия: {synthesis?.Additional_conditions}</FormLabel>
            </Form>

            <Button href='/One-pot-front/syntheses'>К синтезам</Button>
            <p></p>
            <Button href='/One-pot-front/'>Домой</Button>
            <p></p>
        </div>
    )

}

export default SynthesisPage;