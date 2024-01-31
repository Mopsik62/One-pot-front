import { createSlice } from "@reduxjs/toolkit"

const substances = localStorage.getItem('substances')
    ? localStorage.getItem('substances')?.split(',')
    : [];

const initialState = {
    substances,
    ordered: false
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
        addSubstance(state, {payload}) {
            if (state.substances == null) {
                state.substances = []
            }
            if (state.substances.indexOf(payload.toString()) === -1) {
                state.substances.push(payload.toString())
                localStorage.setItem('substances', state.substances.toString())
            }
            state.ordered = true

        },
        removeSubstance(state, {payload}) {
            if (state.substances == null) {
                state.substances = []
            }

            if (state.substances.length == 0) {
                return
            }

            const substanceIndex = state.substances.indexOf(payload.toString())
            if (substanceIndex > -1) {
                state.substances.splice(substanceIndex, 1)
                localStorage.setItem('substances', state.substances.toString())
            }
        },
        disableOrdered(state) {
            state.ordered = false
        }
    }
})

export default cartSlice