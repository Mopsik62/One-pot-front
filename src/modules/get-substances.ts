import {Substance} from './ds'
import axios from 'axios';
import AcetanhydrideImage from '../assets/Acetanhydride.png'
import EpichlorohydrinImage from '../assets/Epichlorohydrin.png'
import PhenylalanineImage from '../assets/L-Phenylalanine.png'


export interface GetSubstancesResponse {
    Substances: Substance[],
    SynthesesChern: number,
}

const offline_substances: Substance[] =  [
    {
        "ID": 1,
        "Title": "Ацетангидрид",
        "Class": "Ангидрид",
        "Formula": "C4H6O3",
        "Image": AcetanhydrideImage?.toString(),
        "Status": "Активно"
    },
    {
        "ID": 2,
        "Title": "Эпихлоргидрин",
        "Class": "Эпоксид",
        "Formula": "C3H5CIO",
        "Image": EpichlorohydrinImage?.toString(),
        "Status": "Активно"
    },
    {
        "ID": 3,
        "Title": "L-фенилаланин",
        "Class": "Аминокислота",
        "Formula": "C9H11NO2",
        "Image": PhenylalanineImage?.toString(),
        "Status": "Активно"
    },];

export const getSubstances = async (userToken ='',namePattern = '', status = '') : Promise<GetSubstancesResponse> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken

        },
    }
    return axios.get(
        '/api/substances?name_pattern=' + String(namePattern) + '&status=' + status,
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
