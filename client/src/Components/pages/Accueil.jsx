import { Link } from "react-router-dom";
import { ReactComponent as NavCircle } from "../../assets/img/Nav_Circle.svg";
import config from "../configuration.json";
import { ReactComponent as Glace } from "../../assets/img/Glace.svg"
import { ReactComponent as Shaker } from "../../assets/img/Shaker.svg"


export function Accueil() {
  return (
    <>
    <div style={{ flexGrow:1, display:"flex", flexDirection:"column"}}>

      <div className="center title">
        <b>FactoryInsight</b>
      </div>


      <div className="center Accueil">



          <Link  aria-label={"Aller sur la station" + 1} className="nav-link" >
            <Glace style={{ scale: "224%" }}/>
          </Link>

          <Link aria-label={"Aller sur la station" + 0} className="nav-link" to={"station/"+(0)} >
            <NavCircle style={{ scale: "800%" }} />
          </Link>

          <Link  aria-label={"Aller sur la station" + 1} className="nav-link" >
            <Shaker style={{ scale: "224%" }}/>
          </Link>
      </div>
    </div>
    </>
  );
}
