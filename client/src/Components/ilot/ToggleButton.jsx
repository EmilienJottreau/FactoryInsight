import { Button } from "./button";
import axios from "axios";

export function ToggleButton({ name, state, url, options = {} }) {
  const ChangeTagValue = (value) => {
    console.log("url+value " + url + value);
    axios.get(url + value, {
      // ...options,
      // headers:{
      //   'Accept':'application/json; charset=UTF-8',
      //   ...options.headers
      // }
    }); //.then((r) => r.json())
  };

  return (
    <>
      <div className="coupleButtons">
        <label>{name.title}</label>
        <div className="twoButtons">
          <Button
            text={state ? name.off : name.on}

            onClick={() => {
              ChangeTagValue(+!state);
            }}
          />
        </div>
      </div>
    </>
  );
}

// disabled={state}
// disabled={!state}
