import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0,
}

export const cartSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setTotalItems: (state, value) => {
            state.totalItems = value.payload;
        }
        //add to cart
        //remove cart
        //reset cart
    }
})

export const {setTotalItems} = cartSlice.actions;
export default cartSlice.reducer;