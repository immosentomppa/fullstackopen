import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'blogs',
  initialState: {message: '', type: ''},
  reducers: {
    showNotification(state, action) {
      return action.payload // { message, type }
    },
    clearNotification() {
      return { message: '', type: '' }
    }
  },
})

export const { showNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message, type = 'success', timeoutSeconds) => {
  return async dispatch => {
    dispatch(showNotification({message, type}))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeoutSeconds*1000)
  }
}

export default notificationSlice.reducer