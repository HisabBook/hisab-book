import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cash: 0,
};

export const posSlice = createSlice({
    name: 'pos',
    initialState,
    reducers: {
        addCash: (state, action) => {
            state.cash += action.payload;
        },
    },
});

export const { addCash } = posSlice.actions;
export default posSlice.reducer;
