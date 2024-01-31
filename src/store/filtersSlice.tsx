import { createSlice } from "@reduxjs/toolkit";

const substanceName = localStorage.getItem('substanceName')
    ? localStorage.getItem('substanceName')
    : '';
const synthesisStatus = localStorage.getItem('synthesisStatus')
    ? localStorage.getItem('synthesisStatus')
    : '';

const initialState = {
    substanceName,
    synthesisStatus,
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSubstanceName(state, {payload}) {
            console.log('setRegionName got regionName: ' + payload)
            state.substanceName = payload
            localStorage.setItem('substanceName', payload)
        },
        setSynthesisStatus(state, {payload}) {
            state.synthesisStatus = payload
            localStorage.setItem('synthesisStatus', payload)
        }
    }
})

export default filtersSlice