import { createSlice, PayloadAction, ActionReducerMapBuilder } from "@reduxjs/toolkit"
import { registerUser, loginUser, logoutUser } from "../modules/authActions"
//import {Simulate} from "react-dom/test-utils";
//import error = Simulate.error;

const userToken = localStorage.getItem('userToken') || ''
const userName = localStorage.getItem('userName') || ''
const userRole = localStorage.getItem('userRole')?.toString() || 'Undefined'

interface AuthState {
    loading: boolean
    userToken: string
    userName: string
    userRole: string
    userInfo: {}
    error: null | any
    success: boolean
}


const initialState: AuthState = {
    loading: false,
    userToken,
    userName,
    userRole,
    userInfo: {},
    error: null,
    success: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
                console.log("reg1")
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false
                state.success = true
                console.log("reg2")

            })
            .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.error = "error"

                console.log(action)

            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null

            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.success = true
                state.userToken = action.payload.access_token
                state.userName = action.payload.login
                console.log("rejected2")

            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.success = false
                console.log(action)
                state.error = "error"
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false
                state.success = true
                state.userToken = ''
                state.userName = ''
            })
            .addCase(logoutUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.success = false
                state.error = action.payload
            })
    },
})

export default authSlice.reducer