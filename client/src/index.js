import React from "react";
import ReactDOM from "react-dom/client";

import App from "./Components/App";
import reportWebVitals from "./reportWebVitals";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PageError } from "./Components/pages/PageError";
import { MainSynoptique } from "./Components/pages/MainSynoptique";
import { MainHistoryGraph } from "./Components/pages/MainHistoryGraph";
import { MainHistoryTable } from "./Components/pages/MainHistoryTable";
import { MainStatistique } from "./Components/pages/MainStatistique";
import { Accueil } from "./Components/pages/Accueil";
import { Contributeurs } from "./Components/pages/Contributeurs";
import { Docs } from "./Components/pages/Docs";

library.add(fas);

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PageError />,
    children: [
      {
        path:"",
        element: <Accueil/>,
      },
      {
        path: "historyGraph",
        element: <MainHistoryGraph />,
      },
      {
        path: "stats",
        element: <MainStatistique />,
      },
      {
        path: "historyTable",
        element: <MainHistoryTable />,
      },
      {
        path: "legal",
        element: <Contributeurs />,
      },
      {
        path:"docs",
        element: <Docs />,
      },
      {
        path: "station",
        children: [
          {
            path: "",
            element: <Accueil />,
          },
          {
            path: ":id",
            element: <MainSynoptique />,
          },
        ],
      },
      {
        path: "user",
        element: (
          <div className="center">
            <div>a faire plus tard, connexion utilisateur</div>
          </div>
        ),
      },
    ],
  }
]);

root.render(
  <>
    {/* <React.StrictMode> */}
      {/* <App /> */}
      {/* <TestRoute /> */}
      <RouterProvider router={router} />
    {/* </React.StrictMode> */}
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
