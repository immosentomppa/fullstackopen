import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'anecdotes',
  initialState: '',
  reducers: {
    setFilter(state, action) {
      return action.payload
    }
  },
})

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer