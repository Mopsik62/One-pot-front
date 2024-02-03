import axios, { AxiosResponse } from "axios";

export const order = async(substances: string, userToken: string, additionalConditions: string, status: string): Promise<AxiosResponse> => {

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
            'status': status,
        },
        config

    )
        .then((response) => response);
}