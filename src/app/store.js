import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice"
import connectionsReducer from "../features/connectionSlice";
import feedReducer from "../features/feedSlice";
import RequestReducer from "../features/requestsSlice";


const store=configureStore({
    reducer:{
        user:userReducer,
        connections:connectionsReducer,
        feed:feedReducer,
        requests:RequestReducer
    }
})

export default store