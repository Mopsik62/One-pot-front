import {FC, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import './SubstancesPage.css'

import { Substance } from './modules/ds'
import { getSubstances } from './modules/get-substances.ts';

import { Row, Col, Modal, Button, Container } from 'react-bootstrap'
import SubstanceCard from './components/SubstanceCard.tsx';
import SubstancesFilter from './components/SubstancesFilter';

import store, { useAppDispatch } from './store/store';
import cartSlice from './store/cartSlice';



const SubstancesPage: FC = () => {
    const {userToken} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const dispatch = useAppDispatch()


    const [substances, setSubstances] = useState<Substance[]>([])
    const {ordered} = useSelector((state: ReturnType<typeof store.getState> ) => state.cart)
    const {substanceName} = useSelector((state: ReturnType<typeof store.getState> ) => state.filters)

    useEffect(() => {

        const loadSubstances = async()  => {

            const result   = await getSubstances(String(userToken), String(substanceName))
           // console.log(result)
            if (result.Substances ) {
                setSubstances(result.Substances)
            }
            console.log


            if (result.SynthesesChern && result.SynthesesChern != 0) {
                dispatch(cartSlice.actions.setDraftID(result.SynthesesChern))

               //const chernSynthesis = await getSynthesis(result.SynthesesChern, userToken)
                console.log(result.SynthesesChern)
              //  dispatch(cartSlice.actions.setAdditionalConditions(chernSynthesis.Additional_conditions))
            } else {
                dispatch(cartSlice.actions.setAdditionalConditions(null))
                dispatch(cartSlice.actions.setDraftID(null))
            }


        }

        loadSubstances()

    }, [substanceName, ordered]);

    const handleModalClose= () => {
        dispatch(cartSlice.actions.disableOrdered())
    }


    return (
        <div>
            <Modal show={ordered} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Субстанция добавлена в корзину</Modal.Title>
                </Modal.Header>
                <Modal.Footer className="d-flex justify-content-center align-items-center">
                    <Button variant="success" onClick={() => {dispatch(cartSlice.actions.disableOrdered())}}>
                        Ок
                    </Button>
                </Modal.Footer>
            </Modal>
            <SubstancesFilter></SubstancesFilter>
            <p></p>
            <Container className="mt-5">
             <Row xs={4} md={4} className='justify-content-center' >
                {substances.map((item, index) => (
                    <Col className="mb-4" key={index}>
                        <SubstanceCard {...{
                            imageUrl: (item.Image == '' ? 'http://127.0.0.1:9000/substances/default.jpg' : item.Image?.toString()),
                            SubstanceName: item.Title,
                            pageUrl: window.location.href.split('?')[0] + "substance?substance_name=" + item.Title
                        }}></SubstanceCard>
                    </Col>
                ))}
             </Row>
            </Container>


        </div>

    )
}

export default SubstancesPage