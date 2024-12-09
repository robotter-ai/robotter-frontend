import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  endDate: Date | null;
  coinValue: { [key: string]: number };
}

const initialState: AppState = {
  endDate: null,
  coinValue: {
    SOL: 0,
    USDC: 0,
  },
};

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setCoinValues: (
      state,
      { payload }: { payload: { [key: string]: number } }
    ) => {
      state.coinValue = { ...state.coinValue, ...payload };
    },
    setEndDate: (state, action: PayloadAction<Date>) => {
      state.endDate = action.payload;
    },
  },
});

export const { setCoinValues, setEndDate } = generalSlice.actions;

export default generalSlice;
