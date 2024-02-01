import {Substance} from './ds'
import axios, { AxiosResponse } from 'axios';

export const editSubstance = async(userToken = '', oldTitle ='', substance: Substance): Promise<AxiosResponse> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.put(
        '/api/substances/' + oldTitle +'/edit',
        {
            ID: substance.ID,
            Title: substance.Title,
            Formula: substance.Formula,
            Class: substance.Class,
            Status: substance.Status,
            Image: substance.Image,
        },
        config

    )
        .then((response) => response);
}