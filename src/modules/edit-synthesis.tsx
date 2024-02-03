import axios from 'axios';

export const editSynthesis = async(userToken = '', synthesis_id: number, name: string, addCond: string  ): Promise<string> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.put(
        '/api/syntheses/' + synthesis_id + '/edit_user',
        {
            'Name': name,
            'Additional_conditions': addCond,
        },
        config

    )
        .then((response) => response.data);
}