import {Substance} from './ds'
import axios from 'axios';
import AcetanhydrideImage from '../assets/Acetanhydride.png'
import EpichlorohydrinImage from '../assets/Epichlorohydrin.png'
import PhenylalanineImage from '../assets/L-Phenylalanine.png'

export const getSubstance = async  (substanceName = ''): Promise<Substance> => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return axios.get(
        '/api/substances/' + String(substanceName),
        config)
        .then((response) => response.data)
        .catch(() => {
            const offline_substances: Substance[] =  [
                {
                    ID: 1,
                    Title: "Ацетангидрид",
                    Class: "Ангидрид",
                    Formula: "C4H6O3",
                    Image: AcetanhydrideImage?.toString(),
                    Status: "Активно"
                },
                {
                    ID: 2,
                    Title: "Эпихлоргидрин",
                    Class: "Эпоксид",
                    Formula: "C3H5CIO",
                    Image: EpichlorohydrinImage?.toString(),
                    Status: "Активно"
                },
                {
                    ID: 3,
                    Title: "L-фенилаланин",
                    Class: "Аминокислота",
                    Formula: "C9H11NO2",
                    Image: PhenylalanineImage?.toString(),
                    Status: "Активно"
                },];

            for (let substance of offline_substances) {
                if (substanceName == substance.Title) {
                    return substance;
                }
            }
        });
}
