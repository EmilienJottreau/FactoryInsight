import { CoupleButtons } from "../ilot/coupleButtons";
import { ToggleButton } from "../ilot/ToggleButton";
import { Cuve } from "../ilot/cuve";
import { useOutletContext, useParams } from "react-router-dom";
import { Context } from "../App";

import config from "../configuration.json";
import { useContext, useEffect } from "react";
import { DisplayValue } from "../ilot/DisplayValue";

export function MainSynoptique() {
  const { id } = useParams();
  const [LastStation, setLastStation] = useOutletContext();

  useEffect(() => setLastStation(id), [id, setLastStation]);

  const values = useContext(Context);
  var stationData = {};

  if (id === "0") {
    if (values && values.stations) {
      stationData = values.stations.Tank;
      console.log(stationData);
    }
  }

  return (
    <main style={{ overflowY: "scroll" }}>
      <div className="leftContainer">
        <div className="ilotName">
          <h1>CUVE {parseInt(id) + 1}</h1>
          <div className="textDescription">
            description du procédé? unt aut facere repellat provident occaecati
            excepturi optio reprehenderi
          </div>
          {/* <div>{JSON.stringify(stationData)}</div> */}
        </div>

        <div className="buttonContainer">
          {config.stations[id].write.map((x, i) => (
            <ToggleButton
              key={x.frendlyName}
              name={{ title: x.frendlyName, on: x.on, off: x.off }}
              url={x.url}
              state={stationData?.[x.name]?.value}
            />
          ))}
        </div>
      </div>
      <div className="synopticContainer">
        <Cuve />
      </div>
      <div
        className="informations"
        style={{ height: "60%", overflowY: "scroll" }}
      >
        {config.stations[id].read.map((x, i) => (
          <DisplayValue
            key={x.name}
            value={stationData?.[x.name]?.value}
            config={x}
          />
        ))}
      </div>
    </main>
  );
}
