import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    theme: 'light',
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';

        },
    },

});

export const {toggleTheme} = settingsSlice.actions;
export default settingsSlice.reducer