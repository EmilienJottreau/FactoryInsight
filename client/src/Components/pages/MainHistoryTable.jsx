import { useOutletContext, useSearchParams } from "react-router-dom";
import config from "../configuration.json";
import { Select } from "../base/Select";
import { useState, useEffect } from "react";

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

  console.log("last station  " + lastStation);
  const tag = searchParams.get("tag");

  const [selected, setSelected] = useState(tag);
  const [data, setData] = useState([]);

  var station = "";
  if (lastStation == 0) {
    station = "Tank";
  }

  useEffect(() => {
    if (selected == "" || selected == null) return;

    const url =
      "http://127.0.0.1:5000/api/v1/history/" +
      station +
      "/" +
      selected +
      "/10";

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((json) => setData(json));
  }, [selected]);
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
