import axios, { AxiosResponse } from 'axios';

export const removeSubstanceFromSynthesis = async(userToken: string, substance_id : number, synthesis_id: number): Promise<AxiosResponse> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.delete(
        '/api/synthesis_substance/' + synthesis_id + '/' + substance_id,
        config

    )
        .then((response) => response);
}