import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
  globalModal: {
    isOpen: false,
    type: null,
    data: null,
  },
  isAutoRefreshEnabled: true,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const id = action.payload.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      // Limit active toasts to 5
      if (state.toasts.length >= 5) {
        state.toasts.shift();
      }
      state.toasts.push({
        id,
        type: action.payload.type,
        message: action.payload.message,
        duration: action.payload.duration ?? 4500,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openGlobalModal: (state, action) => {
      state.globalModal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data ?? null,
      };
    },
    closeGlobalModal: (state) => {
      state.globalModal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    toggleAutoRefresh: (state) => {
      state.isAutoRefreshEnabled = !state.isAutoRefreshEnabled;
    },
    setAutoRefresh: (state, action) => {
      state.isAutoRefreshEnabled = action.payload;
    },
  },
});

export const {
  addToast,
  removeToast,
  openGlobalModal,
  closeGlobalModal,
  toggleAutoRefresh,
  setAutoRefresh,
} = uiSlice.actions;

export default uiSlice.reducer;
