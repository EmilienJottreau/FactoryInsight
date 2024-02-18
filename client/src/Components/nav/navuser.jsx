import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as UserImage } from "../../assets/img/Icon_User.svg";
import { Link } from "react-router-dom";

import { SketchPicker } from "react-color";
import { useState } from "react";

export function NavUser({ user, stroke, fill }) {
  const [state, setState] = useState({
    background: "#fff",
  });

  const handleChangeComplete = (color) => {
    setState({ background: color.hex });

    document.documentElement.style.setProperty("--color-primary", color.hex);

    const hsl =
      "hsl(" +
      color.hsl.h +
      ", " +
      (color.hsl.s / 4) * 100 +
      "%, " +
      color.hsl.l * 100 +
      "%)";

    document.documentElement.style.setProperty("--color-gray", hsl);
  };

  return (
    <div className="navUser">
      <button
        className="themeButton"
        aria-label="changer le theme"
        onClick={() => {
          document.getElementById("colorModal").style.display = "flex";
        }}
      >
        <FontAwesomeIcon icon="fa-solid fa-palette" />
      </button>

      <div id="colorModal" className="modal">
        <div className="center">
          <div className="wrapper center">
            <SketchPicker
              color={state.background}
              onChangeComplete={handleChangeComplete}
            />
            <button
              className="no-fill"
              onClick={() => {
                document.getElementById("colorModal").style.display = "none";
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      <Link to={"/user"}>
        <div className="userName">{user}</div>
        <UserImage stroke={stroke} fill={fill} />
      </Link>
    </div>
  );
}
