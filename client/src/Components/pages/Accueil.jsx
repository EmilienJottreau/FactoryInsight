import { Link } from "react-router-dom";
import { ReactComponent as NavCircle } from "../../assets/img/Nav_Circle.svg";
import config from "../configuration.json";
import { ReactComponent as Mixer } from "../../assets/img/Mixer.svg"
import { ReactComponent as Shaker } from "../../assets/img/Shaker.svg"


export function Accueil() {
  return (
    <>
      <div className="center Accueil">



          <Link  aria-label={"Aller sur la station" + 1} className="nav-link" >
            <Mixer style={{ scale: "224%" }}/>
          </Link>

          <Link aria-label={"Aller sur la station" + 0} className="nav-link" to={"station/"+(0)} >
            <NavCircle style={{ scale: "800%" }} />
          </Link>

          <Link  aria-label={"Aller sur la station" + 1} className="nav-link" >
            <Shaker style={{ scale: "224%" }}/>
          </Link>
      </div>
    </>
  );
}
