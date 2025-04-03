import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userProfileReducer from "./userProfileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    userProfile: userProfileReducer,
  },
});

export default store;
