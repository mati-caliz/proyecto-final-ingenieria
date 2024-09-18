import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface DeepRacerSliceReducer {
    deepRacer: boolean | null;
}

const initialState: DeepRacerSliceReducer = {
    deepRacer: false,
}

export const DeepRacerSlice = createSlice({
    name: 'deepRacer',
    initialState: initialState,
    reducers: {
        setState(state, action: PayloadAction<boolean>) {
            state.deepRacer = action.payload;
        }
    }
})

export const { setState } = DeepRacerSlice.actions;
export default DeepRacerSlice.reducer;