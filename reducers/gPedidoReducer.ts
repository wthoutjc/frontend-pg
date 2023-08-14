import { createSlice } from "@reduxjs/toolkit";

// Interfaces
import { IGPedido, TPedido } from "../interfaces";
import { AppState } from "../store";

const initialState: IGPedido = {
  page: 1,
  limit: 20,
  category: "",
  filter: {
    value: "",
    touched: false,
  },
  firstLoad: true,
};

const gPedidoSlice = createSlice({
  name: "[GPEDIDO]",
  initialState,
  reducers: {
    setPage: (state: IGPedido, action: { payload: number }) => {
      state.page = action.payload;
    },
    setLimit: (state: IGPedido, action: { payload: number }) => {
      state.limit = action.payload;
    },
    setCategory: (state: IGPedido, action: { payload: TPedido }) => {
      state.category = action.payload;
    },
    setFilter: (state: IGPedido, action: { payload: string }) => {
      state.filter.value = action.payload;
    },
    setFilterTouched: (state: IGPedido, action: { payload: boolean }) => {
      state.filter.touched = action.payload;
    },
    setFirstLoad: (state: IGPedido, action: { payload: boolean }) => {
      state.firstLoad = action.payload;
    },
  },
});

export { gPedidoSlice };

// Actions
export const {
  setPage,
  setLimit,
  setCategory,
  setFilter,
  setFilterTouched,
  setFirstLoad,
} = gPedidoSlice.actions;

// Selector to access to the store
export const selectGPedido = (state: AppState) => state.gPedido;

export default gPedidoSlice.reducer;
