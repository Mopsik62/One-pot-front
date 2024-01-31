import {Substance} from './ds'



export const getSubstance = async  (substanceName = ''): Promise<Substance> => {
    return fetch('/api/substances/' + String(substanceName),{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .catch(() => {
            const offline_substances: Substance[] =  [
                {
                    ID: 1,
                    Title: "Ацетангидрид",
                    Class: "Ангидрид",
                    Formula: "C4H6O3",
                    Image: "http://127.0.0.1:9000/substances/default.jpg",
                    Status: "Активно"
                },
                {
                    ID: 2,
                    Title: "Эпихлоргидрин",
                    Class: "Эпоксид",
                    Formula: "C3H5CIO",
                    Image: "http://127.0.0.1:9000/substances/default.jpg",
                    Status: "Активно"
                },
                {
                    ID: 3,
                    Title: "L-фенилаланин",
                    Class: "Аминокислота",
                    Formula: "C9H11NO2",
                    Image: "http://127.0.0.1:9000/substances/default.jpg",
                    Status: "Активно"
                },];

            for (let substance of offline_substances) {
                if (substanceName == substance.Title) {
                    return substance;
                }
            }
        });
}
