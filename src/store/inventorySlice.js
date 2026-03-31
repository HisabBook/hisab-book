import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
};

export const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        testAction: (state, action) => {
            state.items.push(action.payload);
        },
    },
});

export const {testAction} = inventorySlice.actions;
export default inventorySlice.reducer;
