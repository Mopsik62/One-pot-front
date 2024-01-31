import axios from 'axios'

import {Syntheses} from './ds'

export const getSyntheses = async (userToken = '', status = ''): Promise<Syntheses[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.get(
        `/api/syntheses?status=` + status,
        config,
    )
        .then((response) => {
            const { data } = response

            return data;
        })

}