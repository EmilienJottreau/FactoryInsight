import { useOutletContext, useSearchParams } from "react-router-dom";
import config from "../configuration.json";
import { Select } from "../base/Select";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../App";

export function getTagOfStation(id, jsonData) {
  if (jsonData && jsonData.stations && jsonData.stations.length > 0) {
    const station = jsonData.stations[id];
    const writeNames = station.write.map((item) => item.name);
    const modeNames = station.modes.map((item) => item.name);
    const readNames = station.read.map((item) => item.name);
    var arr = [...writeNames, ...modeNames, ...readNames];
    return arr.filter((x, i) => arr.indexOf(x) === i);
  } else {
    return [];
  }
}

export function MainHistoryTable() {
  const [searchParams] = useSearchParams();
  const [lastStation, setLastStation] = useOutletContext();

  const values = useContext(Context);
  var stationData = {};

  console.log("last station  " + lastStation);
  var tag = searchParams.get("tag");
  if(tag==null){
    tag = "liquid_level"
  }

  const [selected, setSelected] = useState(tag);
  const [data, setData] = useState([]);

  var station = "";
  if (lastStation == 0) {
    station = "Tank";
    stationData = values.stations.Tank;
  }

  useEffect(() => {
    if (selected == "" || selected == null) return;

    const url = "/api/v1/values/" + station + "/" + selected + "/10";

    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      // .then((response) => response.json())
      .then((json) => setData(json.data));
  }, [selected]);

  useEffect(() => {
    if (!stationData) {
      return;
    }
    console.log(stationData);
    for (let i = 0; i < Object.keys(stationData).length; i++) {
      const x = stationData[Object.keys(stationData)[i]];
      if (Object.keys(stationData)[i] == selected) {
        setData((newData) => {
          if (newData == [] || newData.at(0).timestamp != x.timestamp) {
            newData.unshift(x);
            return newData.slice(0, 25); // keep only 25 first elems
          }
          return newData;
        });
      }
    }
  }, [stationData, selected, values]);

  const tags = getTagOfStation(lastStation, config);
  return (
    <>
      <div className="center">
        <div className="tableContainer">
          <Select
            items={tags}
            description={"Choisissez le tag"}
            selected={selected}
            setSelected={setSelected}
          />
          {/* Ici sera mis les tableaux de {tag} pour station {lastStation} */}
          {/* <div>{JSON.stringify(data)}</div> */}
          {/* <div>{JSON.stringify(tags)}</div> */}
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Value</th>
                <th scope="col">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.map((x, i) => (
                <tr key={x.id}>
                  <th scope="row">{x.id}</th>
                  <td>{x.value}</td>
                  <td>{x.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
