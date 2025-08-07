import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'anecdotes',
  initialState: '',
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  },
})

export const { showNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message, timeoutSeconds) => {
  return async dispatch => {
    dispatch(showNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeoutSeconds*1000)
  }
}

export default notificationSlice.reducer