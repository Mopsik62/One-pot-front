import { FC, useEffect, useState, useRef } from "react";
import { Card, Form, FormGroup, FormSelect, FormControl, Button, Modal } from "react-bootstrap";
import { Substance } from "./modules/ds";
import { getSubstance } from "./modules/get-substance.ts";
import { useSelector } from "react-redux";
import store from "./store/store";
import { editSubstance } from "./modules/edit-substance";

const SubstanceEditPage: FC = () =>{
    const titleRef = useRef<any>(null)
    const formulaRef = useRef<any>(null)
    const classRef = useRef<any>(null)
    const statusRef = useRef<any>(null)
    const imageRef = useRef<any>(null)

    const [substance, setSubstance] = useState<Substance>()

    const {userToken} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString)
        const substanceTitle = urlParams.get('name')

        const loadSubstance = async () => {
            const result = await getSubstance(String(substanceTitle))
            setSubstance(result)
        }

        loadSubstance()

    }, [])

    const sendChanges = async () => {
        if (!userToken || substance?.ID == undefined) {
            return;
        }
        var oldTitle = substance?.Title
        var title = titleRef.current.value
        console.log(oldTitle)
        console.log(title)
        var formula = formulaRef.current.value
        var classs = classRef.current.value
        var image = imageRef.current.value
        var status = statusRef.current.value

        const editResult = await editSubstance(userToken, oldTitle,
            {
                ID: substance?.ID,
                Title: title ? title : substance?.Title,
                Formula: formula ? formula : substance?.Formula,
                Class: classs ? classs : substance?.Class,
                Status: status ? status : substance?.Status,
                Image: image ? image : substance?.Image
            });
        if (editResult.status == 201) {
            setShowSuccess(true);
        } else {
            setShowError(true);
        }
    }

    const handleErrorClose= () => {
        setShowError(false)
    }
    const handleSuccessClose = () => {
        setShowSuccess(false)
    }

    return (
        <>
            <Modal show = {showError} onHide={handleErrorClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Произошла ошибка, субстанция не была обновлена</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleErrorClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show = {showSuccess} onHide={handleSuccessClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование субстанции прошло успешно!</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSuccessClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <div style={{width: '500px'}}>

                <h1>Редактирование субстанции</h1>
                <Card.Img
                    src={(substance?.Image == '' ? 'http://127.0.0.1:9000/substances/default.jpg' : substance?.Image)}
                    variant="top"
                />
                <Form>
                    <h2>{substance?.Title}</h2>
                    <FormGroup>
                        <label htmlFor="status">Статус</label>
                        <FormSelect id="status" defaultValue={substance?.Status} ref={statusRef}>
                            <option>Активно</option>
                            <option>Удален</option>
                        </FormSelect>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="title">Название</label>
                        <FormControl id="title" defaultValue={substance?.Title} ref={titleRef}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="formula">Формула (км)</label>
                        <FormControl id="formula" defaultValue={substance?.Formula} ref={formulaRef}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="class">Класс</label>
                        <FormControl id="class" defaultValue={substance?.Class} ref={classRef}></FormControl>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="imageName">Ссылка н изображение</label>
                        <FormControl id="imageName" defaultValue={substance?.Image} ref={imageRef}></FormControl>
                    </FormGroup>
                </Form>
                <Button onClick={sendChanges}>Сохранить изменения</Button>
                <p></p>
                <Button href='/One-pot-front/'>Домой</Button>
                <p></p>

            </div>
        </>

    )
}

export default SubstanceEditPage;