import { FC, useState } from "react";
import {useSelector } from "react-redux";

import { Button, ListGroup, ListGroupItem, Form, Row, Col, Modal, } from "react-bootstrap";
import cartSlice from "./store/cartSlice";

import store, { useAppDispatch } from "./store/store";
import { order } from "./modules/order.tsx";
import { editSynthesis } from "./modules/edit-synthesis.tsx";
import { useRef } from "react";


const OrderPage: FC = () => {

    const additionalConditionsRef = useRef<any>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    const dispatch = useAppDispatch()

    const {userToken} = useSelector((state: ReturnType<typeof store.getState> ) => state.auth)

    const {additionalConditions, substances, draftID} = useSelector((state: ReturnType<typeof store.getState>) => state.cart)

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
        let additionalConditions = additionalConditionsRef.current.value
        const combinedString = substances.join(',');

        const result = await order(combinedString, userToken, additionalConditions, "Сформирован")
        if (result.status == 201) {
            setShowSuccess(true)
        } else {
            setShowError(true)
        }
    }

    const saveDraft = async () => {
        if (substances === undefined || userToken === null) {
            return
        }

        let additionalConditions = additionalConditionsRef.current.value
        const combinedString = substances.join(',');



        const result = await order(combinedString, userToken, additionalConditions, "Черновик")
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

    const deleteDraft = async () => {
        console.log(draftID)
        if (!draftID || !userToken) {
            return;
        }

        await editSynthesis(userToken, {
            ID: Number(draftID),
            Name: "",
            Additional_conditions: '',
            Status: 'Удалён',
        })
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

            <h1>Корзина</h1>
            {substances?.length !== 0 &&
                <h3>Выбранные субстанции:</h3>
            }
            {substances?.length === 0 &&
                <h5>Вы ещё не выбрали ни одной субстанции!</h5>
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
                <Row>
                    <Col>
                        <label htmlFor="additionalConditions">Доп условия</label>
                    </Col>
                    <Col>
                        <input
                            ref={additionalConditionsRef}
                            defaultValue={additionalConditions ?? ''}

                        />
                    </Col>

                </Row>
            </Form>
            <p></p>
            <Button onClick={orderSubstance}>Забронировать!</Button>
            <p></p>
            <Button onClick={saveDraft}>Сохранить черновик</Button>
            <p></p>
            <Button onClick={deleteDraft}>Удалить черновик</Button>
            <p></p>
            <Button href="/One-pot-front/">Домой</Button>
        </>
    )

}

export default OrderPage;

