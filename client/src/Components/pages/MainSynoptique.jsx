import { CoupleButtons } from "../ilot/coupleButtons";
import { ToggleButton } from "../ilot/ToggleButton";
import { Cuve } from "../ilot/cuve";
import { useOutletContext, useParams } from "react-router-dom";
import { Context } from "../App";

import config from "../configuration.json";
import { useContext, useEffect } from "react";
import { DisplayValue } from "../ilot/DisplayValue";
import { CuveSvg } from "../ilot/CuveSvg";

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
    <main>
      <div className="leftContainer">
        <div className="ilotName">
          <h1>
            <b>Cuve {parseInt(id) + 1}</b>
          </h1>
          <div className="textDescription"></div>
          {/* <div>{JSON.stringify(stationData)}</div> */}
        </div>

        <div className="buttonContainer">
          {config.stations[id].write.map(
            (x, i) =>
              stationData && (
                <ToggleButton
                  key={x.frendlyName}
                  name={{ title: x.frendlyName, on: x.on, off: x.off }}
                  url={x.url}
                  state={stationData?.[x.name]?.value}
                  isDisabled={
                    stationData.manual_mode &&
                    (x.name === "manual_mode"
                      ? 0
                      : !+stationData.manual_mode.value)
                  }
                />
              )
          )}
        </div>
      </div>
      <div className="synopticContainer">
        {/* <Cuve /> */}
        <CuveSvg stationData={stationData} />
      </div>
      <div className="informations">
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
