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


function getConfigTag(station, tagName) {
    // Parcours des données de la station pour trouver le tag correspondant
    for (var i = 0; i < config.stations[station].read.length; i++) {
        if (config.stations[station].read[i].name === tagName) {
            return config.stations[station].read[i];
        }
    }
    // Si le tag n'est pas trouvé, retourne une chaîne vide
    return "";
}

const possibleRange = [1, 2, 3, 4, 6, 12, 24, 48, 96];

export function MainStatistique() {
  const [selected, setSelected] = useState("liquid_level");
  const [selectedRange, setSelectedRange] = useState(24);
  const [lastStation, setLastStation] = useOutletContext();
  const [data, setData] = useState(null);
  const [recall, setRecall] = useState(0);

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
  const configTag = getConfigTag(lastStation, selected)
  console.log(configTag)
  console.log(data)

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
            description={"Période d'analyse"}
            selected={selectedRange}
            setSelected={setSelectedRange}
            unit={"h"}
          />
        </div>
        <button
          onClick={() => {
            setRecall((a) => a + 1);
          }}
        >
          Rafraîchir
        </button>
        <div className="statsResults">
          <h1 className="center">Statistiques</h1>
          <div className="statsCore">
            <div className="title">Maximum</div>
            {data && <div>{data.max.toFixed(configTag.digit)} {configTag.unit}</div>}
            <div className="title">Moyenne</div>
            {data && <div>{data.mean.toFixed(configTag.digit)} {configTag.unit}</div>}
            <div className="title">Minimum</div>
            {data && <div>{data.min.toFixed(configTag.digit)} {configTag.unit}</div>}
          </div>
          {/* {JSON.stringify(data)} */}
        </div>
      </div>
    </>
  );
}
