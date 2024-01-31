import {Substance} from './ds'


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
    return fetch('/api/substances?name_pattern=' + String(namePattern))
        .then((response) => response.json())

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
