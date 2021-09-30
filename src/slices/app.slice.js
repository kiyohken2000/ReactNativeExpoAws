/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

// ------------------------------------
// Constants
// ------------------------------------

const initialState = {
  checked: false,
  loggedIn: false,
  authState: false,
  me: {}
}

// ------------------------------------
// Slice
// ------------------------------------

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    authenticate: (state, { payload }) => {
      state.loggedIn = payload.loggedIn
      state.checked = payload.checked
    },
    auth: (state, { payload }) => {
      state.authState = payload.authState
    },
    userData: (state, { payload }) => {
      state.me = payload.me
    }
  },
})

export const { action } = appSlice
export const { authenticate, auth, userData } = appSlice.actions

export default appSlice.reducer
