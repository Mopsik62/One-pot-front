import {FC, useEffect, useState} from 'react'
import {Button, Card} from 'react-bootstrap'

import './SubstancePage.css'

import {getSubstance} from './modules/get-substance.ts'
import {Substance} from './modules/ds'


const SubstancePage: FC = () => {

    const [substance, setSubstance] = useState<Substance>()

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString)
        const SubstanceName = urlParams.get('substance_name')

        const loadRegion = async () => {
            const result: Substance = await getSubstance(String(SubstanceName))
            const substanceData = result;
            // console.log(result)
            setSubstance(substanceData)
            // console.log(substance)
        }

        loadRegion()

    }, []);

    return (
        <div className='card_container'>
            <Card style={{width: '300px'}}>
                <Card.Img src={(substance?.Image == '' ? 'http://127.0.0.1:9000/substances/default.jpg' :  substance?.Image)} className="card_image" variant="top" />
                <Card.Body>

                        <p>{substance?.Title && substance.Title}</p>
                        <p> <b>Статус субстанции: {substance?.Status && substance.Status}</b></p>
                        <p> Класс: {substance?.Class && substance.Class}</p>
                        <p> Формула: {substance?.Formula && substance.Formula}</p>

            </Card.Body>
                <Card.Footer>
                    <Button href="/One-pot-front/">Домой</Button>
                </Card.Footer>
            </Card>
        </div>
    )
}

export default SubstancePage