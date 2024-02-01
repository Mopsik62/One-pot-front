import { FC, useState } from "react";
import {useSelector } from "react-redux";

import { Button, ListGroup, ListGroupItem, Form, FormGroup, Modal, FormControl } from "react-bootstrap";
import cartSlice from "./store/cartSlice";

import store, { useAppDispatch } from "./store/store";
import { order } from "./modules/order.tsx";

const OrderPage: FC = () => {

    const [additionalConditions, setConditions] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    const dispatch = useAppDispatch()

    const {userToken} = useSelector((state: ReturnType<typeof store.getState> ) => state.auth)

    const {substances} = useSelector((state: ReturnType<typeof store.getState>) => state.cart)

    const deleteFromCart = (substanceName = '') => {
        return (event: React.MouseEvent) => {
            dispatch(cartSlice.actions.removeSubstance(substanceName))
            event.preventDefault()
        }
    }

    const orderSubstance = async () => {
        if (substances === undefined || userToken === null) {
            return
        }
        const combinedString = substances.join(',');
        const result = await order(combinedString, userToken, additionalConditions)
        if (result.status == 201) {
            setShowSuccess(true)
        } else {
            setShowError(true)
        }
    }

    const handleErrorClose = () => {
        setShowError(false)
    }
    const handleSuccessClose = () => {
        setShowSuccess(false)
    }


    return (
        <>
            <Modal show = {showError} onHide={handleErrorClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ошибка! Не получилось заказать.</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleErrorClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show = {showSuccess} onHide={handleSuccessClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Заказано!</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSuccessClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>

            <h1>Заказ синтеза субстанций</h1>
            {substances?.length !== 0 &&
                <h3>Выбранные субстанции:</h3>
            }
            {substances?.length === 0 &&
                <h4>Вы ещё не выбрали ни одной субстанции!</h4>
            }
            <ListGroup style={{width: '500px'}}>
                {substances?.map((substanceName, substanceID) => (
                    <ListGroupItem key={substanceID}> {substanceName}
                        <span className="pull-right button-group" style={{float: 'right'}}>
                            <Button variant="danger" onClick={deleteFromCart(substanceName)}>Удалить</Button>
                        </span>
                    </ListGroupItem>
                ))
                }
            </ListGroup>
            <h4>Параметры заказа:</h4>
            <Form style={{width: '500px'}}>
                <FormGroup>
                    <label htmlFor="additionalConditions"> Доп условия</label>
                    <FormControl
                        onChange={e => setConditions(e.target.value)}
                    />
                </FormGroup>
            </Form>
            <p></p>
            <Button onClick={orderSubstance}>Забронировать!</Button>
            <p></p>
            <Button href="/One-pot-front/">Домой</Button>
        </>
    )

}

export default OrderPage;