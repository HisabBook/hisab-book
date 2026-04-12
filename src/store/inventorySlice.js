import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
};

export const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
    },
});

export const {addItem} = inventorySlice.actions;
export default inventorySlice.reducer;