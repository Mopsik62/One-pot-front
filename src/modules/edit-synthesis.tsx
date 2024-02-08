import axios from 'axios';

export const editSynthesis = async(userToken = '', synthesis_id: number, name: string, addCond: string, time: string  ): Promise<string> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.put(
        '/api/syntheses/' + synthesis_id + '/edit',
        {
            'Name': name,
            'Additional_conditions': addCond,
            'Time': time,
        },
        config

    )
        .then((response) => response.data);
}