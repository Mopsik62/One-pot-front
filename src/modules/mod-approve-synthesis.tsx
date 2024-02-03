import axios, { AxiosResponse } from 'axios';

export const modApproveSynthesis = async(userToken: string, synthesis_id : number, confirm: string): Promise<AxiosResponse> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.put(
        '/api/syntheses/' + String(synthesis_id) + '/apply',
        {"Confirm": confirm},
        config

    )
        .then((response) => response);
}