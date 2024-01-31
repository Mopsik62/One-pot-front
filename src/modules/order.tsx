import axios, { AxiosResponse } from "axios";

export const order = async(substances: string, userToken: string, additionalConditions: string): Promise<AxiosResponse> => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.put(
        '/api/syntheses/generate',
        {
            'substances': substances,
            'additionalConditions': additionalConditions,
        },
        config

    )
        .then((response) => response);
}