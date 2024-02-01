import {Substance} from './ds'
import axios from 'axios';


export interface GetSubstancesResponse {
    Substances: Substance[],
    CherId: number,
}

const offline_substances: Substance[] =  [
    {
        "ID": 1,
        "Title": "Ацетангидрид",
        "Class": "Ангидрид",
        "Formula": "C4H6O3",
        "Image": "http://127.0.0.1:9000/substances/default.jpg",
        "Status": "Активно"
    },
    {
        "ID": 2,
        "Title": "Эпихлоргидрин",
        "Class": "Эпоксид",
        "Formula": "C3H5CIO",
        "Image": "http://127.0.0.1:9000/substances/default.jpg",
        "Status": "Активно"
    },
    {
        "ID": 3,
        "Title": "L-фенилаланин",
        "Class": "Аминокислота",
        "Formula": "C9H11NO2",
        "Image": "http://127.0.0.1:9000/substances/default.jpg",
        "Status": "Активно"
    },];

export const getSubstances = async (namePattern = '') : Promise<GetSubstancesResponse> => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
    }
    return axios.get(
        '/api/substances?name_pattern=' + String(namePattern),
        config)
        .then((response) => response.data)

        .catch(() => {
            // Фильтрация субстанций по заданному namePattern
            const filteredSubstances = offline_substances.filter(substance =>
                substance.Title.startsWith(namePattern)
            );

            return {
                Substances: filteredSubstances,
                CherId: 0,
            };
        });
}
