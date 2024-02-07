import { CoupleButtons } from "../ilot/coupleButtons";
import { Cuve } from "../ilot/cuve";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useOutletContext, useParams } from "react-router-dom";
import { Context } from "../App";

import config from "../configuration.json";
import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { DisplayValue } from "../ilot/DisplayValue";

export function MainSynoptique() {
  const { id } = useParams();
  const [setLastStation] = useOutletContext();

  useEffect(() => setLastStation(id), [id, setLastStation]);

  //const {loading, data, errors} = useFetchAtStart('https://jsonplaceholder.typicode.com/posts?_limit=10&_delay=2000')
  function changeState(param, value) {
    fetch("http://localhost:8080/" + param + "?val=" + value).catch((e) => {
      console.log(e);
    });
  }

  const values = useContext(Context);
  var stationData = {};

  if (id === "0") {
    stationData = values.stations.tank;
    console.log(stationData);
  }

  return (
    <main style={{  overflowY: 'scroll' }}>
      <div className="leftContainer">
        <div className="ilotName">
          <h1>CUVE {parseInt(id) + 1}</h1>
          <div className="textDescription">
            description du procédé? unt aut facere repellat provident occaecati
            excepturi optio reprehenderi
          </div>
          {/* <div>{JSON.stringify(stationData)}</div> */}
        </div>
        <div className="informations" style={{ height: '60%', overflowY: 'scroll' }}>
          {/* <DisplayValue
            icon={config.stations[id].read[6].icon}
            value={stationData?.[config.stations[id].read[6].name]?.value}
            unit={config.stations[id].read[6].unit}
          /> */}
          {config.stations[id].read.map((x, i) => (
            <DisplayValue
              key={x.name}
              name={x.name}
              icon={x.icon}
              value={stationData?.[x.name]?.value}
              unit={x.unit}
            />
          ))}
        </div>
      </div>
      <div className="synopticContainer">
        <Cuve />
      </div>
      <div className="buttonContainer">
        {config.stations[id].write.map((x, i) => (
          <CoupleButtons
            key={x.frendlyName}
            name={{title: x.frendlyName, on: x.on, off: x.off }}
            url={x.url}
            state={stationData?.[x.name]?.value}
          />
        ))}

        {/* <CoupleButtons
          name={{ title: "Agitateur", on: "Allumer", off: "Eteindre" }}
          state={agitateurState}
          action={{
            on: () => {
              setAgitateurState(true);
              console.log("agitateur on");
            },
            off: () => {
              setAgitateurState(false);
              console.log("agitateur off");
            },
          }}
        /> */}
      </div>
    </main>
  );
}
/*

    <div>
        {loading && <div>Chargement ...</div>}
        {data && <div>{JSON.stringify(data)}</div>}
    </div>

*/
