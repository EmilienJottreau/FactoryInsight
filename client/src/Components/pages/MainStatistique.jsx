import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Select } from "../base/Select";
import config from "../configuration.json";
import axios from "axios";

export function getTagOfStation(id, jsonData) {
  if (jsonData && jsonData.stations && jsonData.stations.length > 0) {
    const station = jsonData.stations[id];
    //   const writeNames = station.write.map((item) => item.name);
    //   const modeNames = station.modes.map((item) => item.name);
    const readNames = station.read.map((item) => item.name);
    var arr = [...readNames];
    return arr.filter((x, i) => arr.indexOf(x) === i);
  } else {
    return [];
  }
}

const possibleRange = [1,2,3,4,6,12,24, 48, 96];

export function MainStatistique() {
  const [selected, setSelected] = useState("liquid_level");
  const [selectedRange, setSelectedRange] = useState(24);
  const [lastStation, setLastStation] = useOutletContext();
  const [data, setData] = useState([]);
  const [recall, setRecall] = useState(0)

  var station = "";
  if (lastStation == 0) {
    station = "Tank";
  }

  useEffect(() => {
    if (selected == "" || selected == null) return;
    // /api/v1/stats/Tank/liquid_level/24
    const url =
      "/api/v1/stats/" + station + "/" + selected + "/" + selectedRange;

    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      // .then((response) => response.json())
      .then((json) => setData(json.data))
      .catch((e) => {
        console.log(e);
      });
  }, [selected, selectedRange, recall]);

  const tags = getTagOfStation(lastStation, config);

  return (
    <>
      <div className="statsPage">
        <div className="stats">
          <Select
            items={tags}
            description={"Choisissez le tag"}
            selected={selected}
            setSelected={setSelected}
          />

          <Select
            items={possibleRange}
            description={"Choisissez un plage horaire"}
            selected={selectedRange}
            setSelected={setSelectedRange}
          />
        </div>
        <button onClick={() => {setRecall((a)=>a+1)}}>Refresh</button>
        <div className="statsResults"> 
        <h1>Stats</h1>
            
            
            {JSON.stringify(data)}</div>
      </div>
    </>
  );
}
