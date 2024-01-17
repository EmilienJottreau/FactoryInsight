import { Link, NavLink, Outlet, RouterProvider, createBrowserRouter, useRouteError } from 'react-router-dom';
import { CuveRoute } from './Components/pages/TestPageCuveRoute';


import useWebSocket, { ReadyState } from "react-use-websocket"
import { useCallback, useEffect, useState } from 'react';
import { io } from "socket.io-client";

import HttpCall from "./Components/HttpCall";
import WebSocketCall from "./Components/WebSocketCall";



const router = createBrowserRouter([
    {
        path: '/',
        element: <Racine />,
        errorElement: <PageError />,
        children: [
            {
                path: 'history',
                element: <div>history</div>
            },
            {
                path: '/cuve',
                children: [
                    {
                        path: '',
                        element: <div>Vous etes sur la page des cuves</div>
                    },
                    {
                        path: ':id',
                        element: <CuveRoute />
                    }
                ]
            }, 
            
        ]

    },
    // {
    //     path: '/history',
    //     element: <div>Historique des valeurs
    //                     <nav>
    //             <Link to={"/"}>Root</Link>
    //             <Link to={"/history"}>History</Link>
    //         </nav>
    //     </div>
    // },

])


export function TestRoute() {

    const [socketInstance, setSocketInstance] = useState("");
    const [loading, setLoading] = useState(true);
    const [buttonStatus, setButtonStatus] = useState(false);
    const [agitateurState,  setAgitateurState]  =useState(0)
  
    const handleClick = () => {
      if (buttonStatus === false) {
        setButtonStatus(true);
      } else {
        setButtonStatus(false);
      }
    };
  
    useEffect(() => {
      console.log("je suis un useeffect debile je m'appelle en boucle")
      if (buttonStatus === true) {
        const socket = io("localhost:5000/", {
          transports: ["websocket"],
          cors: {
            origin: "http://localhost:3000/",
          },
        });
  
        setSocketInstance(socket);
  
        socket.on("connect", (data) => {
          console.log("event connect appelé")
          console.log(data);
        });
  
        setLoading(false);
  
        socket.on("disconnect", (data) => {
          console.log("event disconnect appelé")
          console.log(data);
        });

        socket.on("update")
  
        return function cleanup() {
          socket.disconnect();
        };
      }
    }, [buttonStatus]);



    const toggleAgitateur = () => {
      if (agitateurState == 0){
        socketInstance.emit("agitateur", 0)
        setAgitateurState(1)
      } else {
        socketInstance.emit("agitateur", 1)
        setAgitateurState(0)
      }
    }
  
    return (
      <div className="App">
        <h1>React/Flask App + socket.io</h1>
        <div className="line">
          <HttpCall />
        </div>
        {!buttonStatus ? (
          <button onClick={handleClick}>turn chat on</button>
        ) : (
          <>
            <button onClick={handleClick}>turn chat off</button>
            <div className="line">
              {!loading && <WebSocketCall socket={socketInstance} />}
            </div>

            <button onClick={toggleAgitateur}>Allumer l'agitateur comme un grand</button>
          </>
        )}
      </div>
    );
}


function Racine() {
    return <>

        <header>
            <nav>
                <NavLink to={"/"}>Home</NavLink>
                <NavLink to={"/history"}>History</NavLink>
            </nav>
        </header>
        <div className="container"><Outlet /></div>
    </>
}

function PageError() {
    const error = useRouteError() // renvoie la dernier erreur connue
    console.log(error)
    return <>
        <h1> Une erreur est survenue</h1>
        <p>
            {error?.error?.toString() ?? error?.toString()}
        </p>
    </>
}