import { FC, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Button} from 'react-bootstrap'

//import SynthesisCard from './components/SynthesisCard.tsx'
import store from './store/store'
import { getSyntheses } from './modules/get-syntheses.ts'
import { Syntheses } from './modules/ds'
import { getSynthesisSubstances } from './modules/get-synthesis-substances.tsx'
import SynthesesFilter from './components/SynthesesFilters.tsx'



const SynthesesPage: FC = () => {
    const { userToken, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const [synthesesArray, setSynthesesArray] = useState<string[][]>([])

    useEffect(() => {

        const loadSyntheses = async()  => {
            var syntheses: Syntheses[] = []

            if (userToken !== undefined) {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString)
                let status = urlParams.get('status')
                let startDate = urlParams.get('date1')
                let endDate = urlParams.get('date2')

                syntheses = await getSyntheses(userToken?.toString(), status?.toString(), startDate?.toString(), endDate?.toString())
               // console.log(syntheses)
                // console.log(userToken)

                if (!userToken) {
                    return
                }

                var arr: string[][] = []
                for (let synthesis of syntheses) {
                    const all = await getSynthesisSubstances(synthesis.ID, userToken)

                        const substances = all.Substances
                        const substance_names = []
                    if (all){
                        for (let substance of substances) {
                            substance_names.push(substance.Title)
                        }
                    } else {
                        substance_names.push('')
                    }


                    var synthesisArray:string[] = []
                    synthesisArray.push(synthesis.ID.toString())
                    synthesisArray.push(synthesis.Status)
                    synthesisArray.push(synthesis.Name)
                    synthesisArray.push(substance_names.toString().replace(new RegExp(',', 'g'), '\n'))

                    synthesisArray.push(synthesis.Additional_conditions)
                    if (synthesis.Date_created)
                    {
                        synthesisArray.push(synthesis.Date_created)
                    }
                    if (synthesis.Date_processed)
                    {
                        synthesisArray.push(synthesis.Date_processed)
                    }
                    if (synthesis.Date_finished)
                    {
                        synthesisArray.push(synthesis.Date_finished)
                    }

                    arr.push(synthesisArray)
                }
                setSynthesesArray(arr);
            }
        }
        loadSyntheses()

        const intervalId = setInterval(() => {
            loadSyntheses();
        }, 5000);

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(intervalId);

        console.log(userRole?.toString() == 'Moderator')

    }, [])

    if (!userToken) {
        return (
            <>
                <h3> Для просмотра полётов вам необходимо войти в систему!</h3>
            </>
        )
    }

    return (
        <>
            <h1>Синтезы</h1>
            <SynthesesFilter></SynthesesFilter>
            <Table>
                <thead className='thead-dark'>
                <tr>
                    <th scope='col'>ID</th>
                    <th scope='col'>Статус</th>
                    <th scope='col'>Название</th>
                    <th scope='col'>Субстанции</th>
                    <th scope='col'>Доп. условия</th>
                    <th scope='col'>Дата создания</th>
                    <th scope='col'>Дата обработки</th>
                    <th scope='col'>Дата завершения</th>
                    <th scope='col'></th>
                </tr>

                </thead>
                <tbody>
                {synthesesArray.map((rowContent, rowID) => (
                    <tr key={rowID}>
                        {rowContent.map((val, rowID) => (
                            <td key={rowID}>{val}</td>
                        ))
                        }
                        {((userRole?.toString() == 'Moderator') || (userRole?.toString() == 'Admin')) &&
                            <td>
                                <Button href={'/One-pot-front/synthesis_edit?synthesis_id=' + synthesesArray[rowID][0]}>Изменить</Button>
                            </td>
                        }
                        {(userRole?.toString() == 'User') &&
                            <td>
                                <Button href={'/One-pot-front/synthesis?synthesis_id=' + synthesesArray[rowID][0]}>Просмотр</Button>
                            </td>
                        }
                    </tr>
                ))}

                </tbody>
            </Table>
        </>
    )
}

export default SynthesesPage