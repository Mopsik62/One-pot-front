import { FC, useEffect, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

import store from "./store/store";
import { getSubstances } from "./modules/get-substances.ts";
import { useAppDispatch } from "./store/store";
import cartSlice from "./store/cartSlice";
import SubstancesFilter from "./components/SubstancesFilter";

const ModSubstancesPage : FC = () => {
    const dispatch = useAppDispatch()

    const {userToken, userRole} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
    const {ordered} = useSelector((state: ReturnType<typeof store.getState> ) => state.cart)

    const [substancesArray, setSubstancesArray] = useState<string[][]>([])

    useEffect(() =>  {

        const loadSubstances = async()  => {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString)
            let substanceName = urlParams.get('name_pattern')

            if (substanceName == null) {
                substanceName = "";
            }

            const result = await getSubstances(String(substanceName))
            const substances = result.Substances
            var arr: string[][] = []
            for (let substance of substances) {
                var substanceArray:string[] = []
                substanceArray.push(substance.Image.toString())
                substanceArray.push(substance.ID.toString())
                substanceArray.push(substance.Title)
                substanceArray.push(substance.Status)


                arr.push(substanceArray)
            }
            setSubstancesArray(arr);

        }

        loadSubstances()

    }, [])

    const handleModalClose= () => {
        dispatch(cartSlice.actions.disableOrdered())
    }

    const addSubstanceToCard = (substanceName: string) => {
        dispatch(cartSlice.actions.addSubstance(substanceName))
    }

    if (!userToken || !userRole || (userRole?.toString() != 'Moderator' && userRole?.toString() != 'Admin') ) {
        return (
            <>
                <p>У вас недостатоно прав для просмотра данной страницы.</p>
            </>
        )
    }
    return (
        <>
            <Modal show = {ordered} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Субстанция добавлен в корзину</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={() => {dispatch(cartSlice.actions.disableOrdered())}}>
                        Ок
                    </Button>
                </Modal.Footer>
            </Modal>
            <h1>Субстанции</h1>
            <SubstancesFilter></SubstancesFilter>
            <Table>
                <thead className="thead-dark">
                <tr>
                    <th scope="col">Изображение</th>
                    <th scope="col">ID</th>
                    <th scope="col">Название</th>
                    <th scope="col">Статус</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                {substancesArray.map((rowContent, rowID) => (
                    <tr key={rowID}>
                        <td>
                            <img
                                src={(rowContent[0] == '' ? 'http://127.0.0.1:9000/substances/default.jpg' :  rowContent[0])}
                                style={{width: '100px'}}
                            />
                        </td>
                        {rowContent.slice(1).map((val, rowID) => (

                            <td key={rowID + 1}>{val}</td>
                        ))
                        }
                        <td>
                            <Button href={"/One-pot-front/substance_edit?name=" + rowContent[2]}>
                                Изменить
                            </Button>
                        </td>
                        <td>
                            <Button variant="success" onClick={() => {addSubstanceToCard(rowContent[2])}}>Заказать</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

        </>
    )
}

export default ModSubstancesPage;