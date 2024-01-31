import {SynthesisWithSubstances} from "./ds"

import axios from "axios"

export const getSynthesisSubstances = async(synthesis_id = 0, userToken = ''): Promise<SynthesisWithSubstances> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.get(
        '/api/syntheses/' +  String(synthesis_id),
        config)
        .then((response) => {
            const {data} = response

            return data;
        })
}