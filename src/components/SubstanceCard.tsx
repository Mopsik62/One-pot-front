import { FC } from 'react'
import { useSelector } from 'react-redux'
import {Button, ButtonGroup, Card} from 'react-bootstrap'
import store, { useAppDispatch } from '../store/store'

import './SubstanceCard.css'

import cartSlice from '../store/cartSlice'

interface Props {
    imageUrl: string
    SubstanceName: string
    pageUrl: string
}

const SubstanceCard: FC<Props> = ({ imageUrl, SubstanceName, pageUrl}) => {
    const dispatch = useAppDispatch()

    const {userRole} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const addSubstnaceToCard = () => {
        dispatch(cartSlice.actions.addSubstance(SubstanceName))
    }

    const deleteSubstance = async () => {
        await fetch('/api/substance/delete/' + SubstanceName, {
            method: 'PUT'
        });
        window.location.replace('/')
    }

    return (
        <Card className='w-70 h-100'>
            <Card.Img variant="top" src={imageUrl}/>
            <Card.Body className='d-flex flex-column card-body-wrapper'>
                <Card.Title> {SubstanceName} </Card.Title>
                <ButtonGroup className='text-center button-group'>
                    <Button variant="info" href={pageUrl}>Подробнее</Button>
                    {((userRole?.toString() === 'Moderator') || (userRole?.toString() === 'Admin')) &&
                        <Button variant="warning" onClick={deleteSubstance}>Удалить</Button>
                    }
                    <Button variant="success" onClick={addSubstnaceToCard}>Заказать</Button>
                </ButtonGroup>
            </Card.Body>

        </Card>

    )

}

export default SubstanceCard;