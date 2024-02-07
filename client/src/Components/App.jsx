import { useState, useEffect, createContext } from "react";
import { NavBar } from "./nav/navbar";
import { LeftMenu } from "./menu/leftmenu";
import { Scrim } from "./scrim";
import { io } from "socket.io-client";

import { Outlet } from "react-router-dom";

export const Context = createContext({});

function App() {

  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible((value) => !value);
  const [lastStation, setLastStation] = useState(0);

  const [donnees, setDonnees] = useState({ stations: {} });

  const handleDataChange = (data) => {
    // ajout de donnée dans l'array des données recues
    const parsedData = JSON.parse(data);
    const { station, tag } = parsedData;
    console.log("maj a cause de : " + tag.name)

    // setDonnees((prevData) => [...prevData, data]);
    setDonnees((prevData) => {

      const newData = {...prevData}

      if (!newData.stations[station]) {
        // If the station doesn't exist, create it
        newData.stations[station] = {
        };
      }

      newData.stations[station][tag.name] = {
        value: tag.value,
        timestamp: tag.timestamp,
      };
      // console.log("Nouvelles données" + JSON.stringify(newData))
      return newData
    });
  }


  useEffect(() => {
    const socket = io("localhost:5000/", {
      transports: ["websocket"],
      cors: {
        origin: "http://localhost:3000/",
      },
    });

    socket.on("connect", (data) => {
      console.log("event connect appelé");
      fetch("http://127.0.0.1/setup")
    });

    socket.on("disconnect", (data) => {
      console.log("event disconnect appelé");
      console.log(data);
    });


    socket.on("datachange", (data) => {
      handleDataChange(data)
    });

    return function cleanup() {
      socket.disconnect();
    };
  }, []);



  return (
    <div className="App">
      <NavBar toggleMenu={toggleMenu} menuVisible={menuVisible} />

      <div className="below-nav">
        {menuVisible && (
          <LeftMenu
            lastStation={lastStation}
            closeMenu={() => setMenuVisible(false)}
          />
        )}
        <div className="mainContent">
          <Context.Provider value={donnees}>
            <Outlet context={[lastStation, setLastStation]}/>
            {menuVisible && <Scrim />}
          </Context.Provider>
        </div>
      </div>
    </div>
  );
}

export default App;
