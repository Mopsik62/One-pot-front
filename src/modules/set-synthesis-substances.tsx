import axios, { AxiosResponse } from "axios";

export const setSynthesisSubstances = async(synthesis_id = 0, substances_names: string[], userToken='') : Promise<AxiosResponse> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }

    // Объединяем массив строк в одну строку с разделителем ","
    const substancesString = substances_names.join(',');

    return axios.put(
        '/api/syntheses/' +String(synthesis_id) + '/set_substances',
        {
            synthesisID: synthesis_id,
            substances: substancesString
        },
        config
    )
        .then((response) => response)
}