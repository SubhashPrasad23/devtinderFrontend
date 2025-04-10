import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { Provider } from "react-redux";
import store from "./app/store.js";
import Profile from "./components/Profile.jsx";
import Home from "./pages/Home.jsx";
import Onboard from "./components/OnBoard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Requests from "./pages/Requests.jsx";
import Connections from "./pages/Connections.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Onboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/app",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "connections",
        element: <Connections/>,
      },
      {
        path: "requests",
        element: <Requests />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
