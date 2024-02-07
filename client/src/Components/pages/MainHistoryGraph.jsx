import { useOutletContext, useSearchParams } from "react-router-dom";
import { getTagOfStation } from "./MainHistoryTable";
import config from "../configuration.json";
import { useState, useEffect } from "react";
import { Select } from "../base/Select";

export function MainHistoryGraph() {
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
        <div className="graphicContainer">
          Ici sera mis les graphiques de {tag} pour station {lastStation}

          <Select
            items={tags}
            description={"Choisissez le tag"}
            selected={selected}
            setSelected={setSelected}
          />
          <div>{JSON.stringify(data)}</div>

          <div className="rootGraphic">
            Mettre graphique ici
          </div>

        </div>
      </div>
    </>
  );
}
