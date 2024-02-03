import {Substance} from './ds'
import axios, { AxiosResponse } from 'axios';

export const createSubstance = async(userToken = '', substance: Substance): Promise<AxiosResponse> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.post(
        '/api/substances/add',
        {
            ID: substance.ID,
            Title: substance.Title,
            Formula: substance.Formula,
            Status: substance.Status,
            Class: substance.Class,
            Image: substance.Image,
        },
        config

    )
        .then((response) => response);
}