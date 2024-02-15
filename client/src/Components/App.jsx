import { useState, useEffect, createContext } from "react";
import { NavBar } from "./nav/navbar";
import { LeftMenu } from "./menu/leftmenu";
import { Scrim } from "./scrim";
import { io } from "socket.io-client";

import { Outlet } from "react-router-dom";
import axios from "axios";

export const Context = createContext({});

function App() {

  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible((value) => !value);
  const [lastStation, setLastStation] = useState(0);

  const [donnees, setDonnees] = useState({ stations: {} });

  const handleDataChange = (data) => {
    // ajout de donnée dans l'array des données recues
    // const parsedData = JSON.parse(data);
    console.log(data)
    // const { station, tag, name,  } = data;
    console.log("maj a cause de : " + data.tag)

    // setDonnees((prevData) => [...prevData, data]);
    setDonnees((prevData) => {

      const newData = {...prevData}
      console.log(newData)

      if (!newData.stations) {
        newData.stations = {}; // Initialize newData.stations if it doesn't exist
      }
      if (!newData.stations[data.station]) {
        // If the station doesn't exist, create it
        newData.stations[data.station] = {
        };
      }

      newData.stations[data.station][data.tag] = {
        value: data.value,
        timestamp: data.timestamp,
        id:data.id
      };
      // console.log("Nouvelles données" + JSON.stringify(newData))
      return newData
    });
  }


  useEffect(() => {
    const socket = io(
      // "http://localhost:5000",
      {
      transports: ["websocket"],
      cors: {
        origin: "http://localhost:3000/",
      },
    });

    socket.on("connect", (data) => {
      console.log("event connect appelé");
      // fetch("http://127.0.0.1/setup")
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

  const refreshDataStation = () => {
    axios
    .get("/api/v1/history/1", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
    // .then((response) => response.json())
    .then((json) => setDonnees(()=>{
      json.data.map((x, i)=>{
        handleDataChange(x)
      })
    }));

  }

  useEffect(()=>{
    refreshDataStation()
  }, [lastStation])



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
