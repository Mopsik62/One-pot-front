import axios, { AxiosResponse } from 'axios';

export const approveSynthesis = async(userToken: string, synthesis_id : number): Promise<AxiosResponse> => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.put(
        '/api/syntheses/' + String(synthesis_id)+ '/apply_user',
        {},
        config

    )
        .then((response) => response);
}