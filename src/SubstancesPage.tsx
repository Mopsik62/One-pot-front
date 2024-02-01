import {FC, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import './SubstancesPage.css'

import { Substance } from './modules/ds'
import { GetSubstancesResponse, getSubstances } from './modules/get-substances.ts';

import { Row, Modal, Button } from 'react-bootstrap'
import SubstanceCard from './components/SubstanceCard.tsx';
import SubstancesFilter from './components/SubstancesFilter';

import store, { useAppDispatch } from './store/store';
import cartSlice from './store/cartSlice';

import ModSubstancesPage from './ModSubstancesPage';


const SubstancesPage: FC = () => {
    const {userRole} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const dispatch = useAppDispatch()


    const [substances, setSubstances] = useState<Substance[]>([])
    const {ordered} = useSelector((state: ReturnType<typeof store.getState> ) => state.cart)

    useEffect(() => {

        const loadSubstances = async()  => {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString)
            let substanceName = urlParams.get('name_pattern')
            if (substanceName == null) {
                substanceName = "";
            }

            const result : GetSubstancesResponse = await getSubstances(String(substanceName))
            // console.log(result)
            if (result.Substances) {
                setSubstances(result.Substances)
            }


        }

        loadSubstances()

    }, []);

    const handleModalClose= () => {
        dispatch(cartSlice.actions.disableOrdered())
    }

    if (userRole?.toString() == 'Moderator' || userRole?.toString() == 'Admin') {
        return (
            <ModSubstancesPage></ModSubstancesPage>
        )
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

            <Row xs={8} md={8} className='g-4' >
                {substances.map((item, index) => (
                    <div className="col-2" key={index}>
                        <SubstanceCard {...{
                            imageUrl: (item.Image == '' ? 'http://127.0.0.1:9000/substances/default.jpg' : item.Image?.toString()),
                            SubstanceName: item.Title,
                            pageUrl: window.location.href.split('?')[0] + "substance?substance_name=" + item.Title
                        }}></SubstanceCard>
                    </div>
                ))}
            </Row>



        </div>

    )
}

export default SubstancesPage