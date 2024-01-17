import { Link, NavLink, Outlet, RouterProvider, createBrowserRouter, useRouteError } from 'react-router-dom';
import { CuveRoute } from './Components/pages/TestPageCuveRoute';


import useWebSocket, { ReadyState } from "react-use-websocket"
import { useCallback, useEffect, useState } from 'react';




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
            }
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

    const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
    const [messageHistory, setMessageHistory] = useState([]);

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage, setMessageHistory]);

    const handleClickChangeSocketUrl = useCallback(
        () => setSocketUrl('wss://demos.kaazing.com/echo'),
        []
    );

    const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div>
          <RouterProvider router={router} />

          
          <button onClick={handleClickChangeSocketUrl}>
            Click Me to change Socket Url
          </button>
          <button
            onClick={handleClickSendMessage}
            disabled={readyState !== ReadyState.OPEN}
          >
            Click Me to send 'Hello'
          </button>
          <span>The WebSocket is currently {connectionStatus}</span>
          {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
          <ul>
            {messageHistory.map((message, idx) => (
              <span key={idx}>{message ? message.data : null}</span>
            ))}
          </ul>
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