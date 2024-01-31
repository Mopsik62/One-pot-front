import {Syntheses} from './ds'
import axios from 'axios';

export const editSynthesis = async(userToken = '', synthesis: Syntheses): Promise<string> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.put(
        '/api/syntheses/' + synthesis.ID + '/edit_user',
        {
            'Name': synthesis.Name,
            'Additional_conditions': synthesis.Additional_conditions,
        },
        config

    )
        .then((response) => response.data);
}