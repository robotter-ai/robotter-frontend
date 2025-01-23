import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  endDate: Date | null;
  expenses: number;
  isFetchCandleData: boolean;
  disabledRunBacktest: boolean;
  fee: number;
  coinValue: { [key: string]: number };
}

const initialState: AppState = {
  endDate: null,
  expenses: 0,
  isFetchCandleData: true,
  disabledRunBacktest: true,
  fee: 0,
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
    setExpensesFee: (
      state,
      { payload }: { payload: { expenses: number; fee: number } }
    ) => {
      state.expenses = payload.expenses;
      state.fee = payload.fee;
    },
    setDisabledRunBacktest: (state, { payload }: { payload: boolean }) => {
      state.disabledRunBacktest = payload;
    },
    setIsFetchCandleData: (state, { payload }: { payload: boolean }) => {
      state.isFetchCandleData = payload;
    }
  },
});

export const {
  setEndDate,
  setCoinValues,  
  setExpensesFee,
  setIsFetchCandleData,
  setDisabledRunBacktest,
} = generalSlice.actions;

export default generalSlice;
