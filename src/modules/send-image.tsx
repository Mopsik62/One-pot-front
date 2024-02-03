import axios, { AxiosResponse } from "axios";

export const sendImage = async (userToken = '', substance_id: string, file: File): Promise<AxiosResponse> => {
    const formData = new FormData();
    formData.append('file', file)
    formData.append('Authorization', 'Bearer ' + userToken)


    return axios.post(
        `/api/substances/` + substance_id + `/add_image`,
        formData
    )
        .then((response) => response.data)

}