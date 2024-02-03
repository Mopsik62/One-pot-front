import { FC, useEffect, useState, useRef, ChangeEvent } from "react";
import { Card, Form, FormGroup, FormSelect, FormControl, Button, Modal, Row, Col } from "react-bootstrap";
import { Substance } from "./modules/ds";
import { getSubstance } from "./modules/get-substance.ts";
import { useSelector } from "react-redux";
import store from "./store/store";
import { editSubstance } from "./modules/edit-substance";
import { sendImage } from "./modules/send-image";
import { createSubstance } from "./modules/create-substance";


const SubstanceEditPage: FC = () =>{
    const titleRef = useRef<any>(null)
    const formulaRef = useRef<any>(null)
    const classRef = useRef<any>(null)
    const statusRef = useRef<any>(null)
    // const imageRef = useRef<any>(null)
  //  const nameRef = useRef<any>(null)

    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    const [substance, setSubstance] = useState<Substance>()
    const [newSubstance, setNewSubstance] = useState(false)

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

        if (substanceTitle != 'new') {
            loadSubstance()
        } else {
            setNewSubstance(true)
        }

    }, [])

    const sendChanges = async () => {
        if (!userToken) {
            return;
        }
        var oldTitle = substance?.Title
        var title = titleRef.current.value
        console.log(title)
        var formula = formulaRef.current.value
        var classs = classRef.current.value
        // var image = imageRef.current.value
        var status = statusRef.current.value

        const substance_str: Substance = {
            ID: substance?.ID ? substance?.ID : 0,
            Title: title ? title : substance?.Title,
            Formula: formula ? formula : substance?.Formula,
            Class: classs ? classs : substance?.Class,
            Status: status ? status : substance?.Status,
            Image: substance?.Image ? substance?.Image : "",
        };

        if (newSubstance) {
            console.log(substance_str)
            const creationResult = await createSubstance(userToken, substance_str)

            if (creationResult.status == 201) {
                setShowSuccess(true);
            } else {
                setShowError(true);
            }

            const new_substance = await getSubstance(substance_str.Title)
            if (selectedFile) {
                const imageResult = await sendImage(userToken, String(new_substance.ID), selectedFile);

                console.log(imageResult.status)
            }
        } else {
            const editResult = await editSubstance(userToken,oldTitle,  substance_str);
            if (editResult.status == 201) {
                setShowSuccess(true);
            } else {
                setShowError(true);
            }

            if (selectedFile) {
                const imageResult = await sendImage(userToken, String(substance?.ID), selectedFile);

                console.log(imageResult.status)
            }



        }


        if (selectedFile) {
            const imageResult = await sendImage(userToken, String(substance?.ID), selectedFile);

            console.log(imageResult.status)
        }
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleErrorClose= () => {
        setShowError(false)
    }
    const handleSuccessClose = () => {
        setShowSuccess(false)
        // можно добавить навигейт
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
            <Form style={{width: '500px', marginRight: 'auto', marginLeft: 'auto', alignItems: 'center', justifyContent: 'center'}}>
                <Row className="justify-content-center">
                    <Card.Img
                        style={{width: '200px'}}
                        src={(substance?.Image == '' ? 'http://127.0.0.1:9000/substances/default.jpg' : substance?.Image)}
                        variant="top"
                    />
                </Row>

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
                    <label htmlFor="formula">Формула</label>
                    <FormControl id="formula" defaultValue={substance?.Formula} ref={formulaRef}></FormControl>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="class">Класс</label>
                    <FormControl id="class" defaultValue={substance?.Class} ref={classRef}></FormControl>
                </FormGroup>

                <FormGroup>
                    <Row>
                        <Col>
                            <label htmlFor="image">Изображение</label>
                        </Col>
                        <Col>
                            <input id="image" defaultValue={substance?.Image} onChange={handleFileChange} type="file"  accept="image/*"></input>                            </Col>
                    </Row>
                </FormGroup>

                <p></p>
                <Row>
                    <Button onClick={sendChanges}>Сохранить изменения</Button>
                </Row>
                <p></p>
                <Row>
                    <Button href='/One-pot-front/'>Домой</Button>
                </Row>
                <p></p>

            </Form>
        </>

    )
}

export default SubstanceEditPage;