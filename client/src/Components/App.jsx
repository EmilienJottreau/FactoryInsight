import { useState, useEffect } from 'react';
import { NavBar } from './nav/navbar';
import { LeftMenu } from './menu/leftmenu';
import { Scrim } from './scrim';
import { io } from "socket.io-client";

import { Outlet } from 'react-router-dom';





function App() {
  const [socketInstance, setSocketInstance] = useState("");
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleChecked = () => setMenuVisible(value => !value);


  useEffect(()=>{

    const socket = io("localhost:5000/", {
      transports: ["websocket"],
      cors: { 
        origin: "http://localhost:3000/",
      },
    });

    socket.on("connect", (data) => {
      console.log("event connect appelé")
      console.log(data);
    });


    socket.on("disconnect", (data) => {
      console.log("event disconnect appelé")
      console.log(data);
    });

    socket.on("datachange", (data) => (
      console.log(data)
    ));



    setSocketInstance(socket);
    return function cleanup() {
      socket.disconnect();
    };
  }, [])


  return (
    <div className="App">



      <NavBar toggleMenu={toggleChecked} menuVisible={menuVisible}/>

      <div className='below-nav'>
        {menuVisible && <LeftMenu/>}
        <div className='mainContent'>
          <Outlet/>
          {menuVisible && <Scrim/>}
        </div>
      </div>

    </div>
  );
}

export default App;
