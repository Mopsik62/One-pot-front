import axios, { AxiosResponse } from 'axios';

export const deleteSynthesis = async(userToken: string, synthesis_id : number): Promise<AxiosResponse> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.delete(
        '/api/syntheses/' + String(synthesis_id) + '/delete',
        config

    )
        .then((response) => response);
}