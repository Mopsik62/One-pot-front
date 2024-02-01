import axios from 'axios'

import {Syntheses} from './ds'

export const getSyntheses = async (userToken = '', status = '', startDate = '', endDate = ''): Promise<Syntheses[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.get(
        `/api/syntheses?status=` + status + '&date1=' + startDate + '&date2=' + endDate,
        config,
    )
        .then((response) => response.data)

}