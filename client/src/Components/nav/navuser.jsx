import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as UserImage } from "../../assets/img/Icon_User.svg";
import { Link } from "react-router-dom";

import { SketchPicker } from "react-color";
import { useState } from "react";

export function NavUser({ user, stroke, fill }) {


  const [state, setState] = useState({
    background: "#fff",
  })

  const handleChangeComplete = (color) => {
    setState({ background: color.hex });
    
    
    document.documentElement.style.setProperty(
      '--color-primary',
      color.hex
    );
  };

  return (
    <div className="navUser">
      <button
        onClick={() => {
          document.getElementById("colorModal").style.display = "block";
        }}
      >
        <FontAwesomeIcon icon="fa-solid fa-palette" />
      </button>

      <div id="colorModal" className="modal">
        <SketchPicker
          color={state.background}
          onChangeComplete={handleChangeComplete}
        />
        <button
          onClick={() => {
            document.getElementById("colorModal").style.display = "none";
          }}
        >
          Fermer
        </button>
      </div>

      <Link to={"/user"}>
        <div className="userName">{user}</div>
        <UserImage stroke={stroke} fill={fill} />
      </Link>
    </div>
  );
}
