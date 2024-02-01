import { createSlice } from "@reduxjs/toolkit";

const substanceName = localStorage.getItem('substanceName')
    ? localStorage.getItem('substanceName')
    : '';
const synthesisStatus = localStorage.getItem('synthesisStatus')
    ? localStorage.getItem('synthesisStatus')
    : '';

const startDate = localStorage.getItem('startDate')
    ? localStorage.getItem('startDate')
    : '';

const endDate = localStorage.getItem('endDate')
    ? localStorage.getItem('endDate')
    : '';

const initialState = {
    substanceName,
    synthesisStatus,
    startDate,
    endDate
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
        },
        setStartDate(state, {payload}) {
            state.startDate = payload
            localStorage.setItem('startDate', payload)
        },
        setEndDate(state, {payload}) {
            state.endDate = payload
            localStorage.setItem('endDate', payload)
        }
    }
})

export default filtersSlice