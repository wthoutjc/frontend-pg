import { createSlice } from "@reduxjs/toolkit";

//Interfaces
import { INotification, UI } from "../interfaces";
import { AppState } from "../store";

const initialState: UI = {
  notifications: [],
  request: {
    loading: false,
    fullscreen: false,
    action: null,
  },
  openSidebar: false,
  isMobile: false,
  modal: {
    open: false,
    title: "",
    type: "",
    section: null,
    info: null,
  },
};

interface NewNotification {
  payload: INotification;
}
interface RemoveNotification {
  payload: string;
}
interface RequestAction {
  payload: {
    loading: boolean;
    fullscreen: boolean;
    action: string | null;
  };
}

const uiSlice = createSlice({
  name: "[UI]",
  initialState,
  reducers: {
    newNotification: (state: UI, action: NewNotification) => {
      state.notifications = [...state.notifications, action.payload];
    },
    removeNotification: (state: UI, action: RemoveNotification) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    setRequest: (state: UI, action: RequestAction) => {
      state.request = action.payload;
    },
    resetRequest: (state: UI) => {
      state.request = {
        loading: false,
        fullscreen: false,
        action: null,
      };
    },
    setOpenSidebar: (state: UI, action: { payload: boolean }) => {
      state.openSidebar = action.payload;
    },
    setIsMobile: (state: UI, action: { payload: boolean }) => {
      state.isMobile = action.payload;
    },
    setModal: (state: UI, action: { payload: UI["modal"] }) => {
      state.modal = action.payload;
    },
  },
});

export { uiSlice };

// Actions
export const {
  newNotification,
  removeNotification,
  setRequest,
  setOpenSidebar,
  resetRequest,
  setIsMobile,
  setModal,
} = uiSlice.actions;

// Select to access to the store
export const selectUI = (state: AppState) => state.auth;

export default uiSlice.reducer;
