import { useState } from "react";
import { useFetchAtStart } from "../../hooks/useFetch";
import { Button } from "../ilot/button";
import { CoupleButtons } from "../ilot/coupleButtons";
import { Cuve } from "../ilot/cuve";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";

import config from "../configuration.json";

export function MainSynoptique() {
  const { id } = useParams();

  //const {loading, data, errors} = useFetchAtStart('https://jsonplaceholder.typicode.com/posts?_limit=10&_delay=2000')
  function changeState(param, value) {
    fetch("http://localhost:8080/" + param + "?val=" + value).catch((e) => {
      console.log(e);
    });
  }

  console.log(config);

  const [agitateurState, setAgitateurState] = useState(false);

  return (
    <main>
      <div className="leftContainer">
        <div className="ilotName">
          <h1>CUVE {id+1}</h1>
          <div className="textDescription">
            description du procédé? unt aut facere repellat provident occaecati
            excepturi optio reprehenderi
          </div>
        </div>
        <div className="informations">
          <div className="logo-info">
            <FontAwesomeIcon icon="fa-solid fa-temperature-half" />
            <div>
              <p className="placeholder-glow">
                <span className="placeholder col-8 placeholder-lg"></span>
              </p>
            </div>
          </div>
          <div className="logo-info">
            <FontAwesomeIcon icon="fa-solid fa-arrows-up-down" />
            <div>
              <p className="placeholder-glow">
                <span className="placeholder col-8 placeholder-lg"></span>
              </p>
            </div>
          </div>
          <div className="logo-info">
            <FontAwesomeIcon icon="fa-solid fa-arrows-rotate" />
            <div>
              <p className="placeholder-glow">
                <span className="placeholder col-8 placeholder-lg"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="synopticContainer">
        <Cuve />
      </div>
      <div className="buttonContainer">

        {config.stations[id].write.map((x, i) => (
          <CoupleButtons
            name={{ title: x.frendlyName, on: x.on, off: x.off }}
            action={{ on: () => {}, off: () => {} }}
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
