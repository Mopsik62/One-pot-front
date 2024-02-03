import { FC } from 'react'
import { useSelector } from 'react-redux'
import {Button, ButtonGroup, Card} from 'react-bootstrap'
import store, { useAppDispatch } from '../store/store'
import { order } from "../modules/order.tsx";

import './SubstanceCard.css'

import cartSlice from '../store/cartSlice'
import { useNavigate } from 'react-router-dom'


interface Props {
    imageUrl: string
    SubstanceName: string
    pageUrl: string
}

const SubstanceCard: FC<Props> = ({ imageUrl, SubstanceName, pageUrl}) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { userToken} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const addSubstnaceToCard = async () => {
        if (!userToken) {
            return;
        }
        dispatch(cartSlice.actions.addSubstance(SubstanceName))
        await order(SubstanceName, userToken, "", "Черновик")
        navigate('/One-pot-front/')
    }

    // const deleteSubstance = async () => {
    //     await fetch('/api/substance/delete/' + SubstanceName, {
    //         method: 'PUT'
    //     });
    //     window.location.replace('/')
    // }

    return (
        <Card className='w-70 h-100'>
            <Card.Img variant="top" src={imageUrl}/>
            <Card.Body className='d-flex flex-column card-body-wrapper'>
                <Card.Title> {SubstanceName} </Card.Title>
                <ButtonGroup className='text-center button-group'>
                    <Button variant="info" href={pageUrl}>Подробнее</Button>
                    { userToken &&
                    <Button variant="success" onClick={addSubstnaceToCard}>Заказать</Button>
                    }
                </ButtonGroup>
            </Card.Body>
        </Card>

    )

}

export default SubstanceCard;