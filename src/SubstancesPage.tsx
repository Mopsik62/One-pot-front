import {FC, useEffect, useState} from 'react'
import './SubstancesPage.css'

import { Substance } from './modules/ds'
import { GetSubstancesResponse, getSubstances } from './modules/get-substances.ts';

import { Col, Row} from 'react-bootstrap'
import SubstanceCard from './components/SubstanceCard.tsx';

import defaultImage from './assets/react.svg'

const SubstancesPage: FC = () => {

    const [substances, setSubstances] = useState<Substance[]>([])

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString)
        var substanceName = urlParams.get('name_pattern')
        if (substanceName == null) {
            substanceName = "";
        }

        const loadSubstances = async()  => {
            const result : GetSubstancesResponse = await getSubstances(String(substanceName))
            console.log(result)
            if (result.Substances) {
                setSubstances(result.Substances)
            }


        }

        loadSubstances()

    }, []);

    return (
        <div>
            <div>
                <form method="GET" action="" name="search">
                    <input type="text" id="substance_search" name="name_pattern"/>
                    <input type="submit" className="button" value="Поиск" ></input>
                </form>
            </div>

            <Row xs={4} md={4} className='g-4' >
                {substances.map((item, index) => (
                    <Col key={index}>
                        <SubstanceCard {...{
                            imageUrl: (item.Image == '' ? defaultImage?.toString() : item.Image?.toString()),
                            SubstanceName: item.Title,
                            pageUrl: window.location.href.split('?')[0] + "substance?substance_name=" + item.Title
                        }}></SubstanceCard>
                    </Col>
                ))}
            </Row>



        </div>

    )
}

export default SubstancesPage