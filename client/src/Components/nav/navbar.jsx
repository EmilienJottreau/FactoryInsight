import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavUser } from "./navuser";

import { ReactComponent as NavCircle } from "../../assets/img/Nav_Circle.svg";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import config from "../configuration.json";
import { MenuBurger } from "../base/MenuBurger";

import { ReactComponent as Glace } from "../../assets/img/Glace.svg"
import { ReactComponent as Shaker } from "../../assets/img/Shaker.svg"

export function NavBar({ toggleMenu, menuVisible }) {
  return (
    <nav className="navbar">
      <MenuBurger toggleMenu={toggleMenu}/>
      <div className="center">
        {/* {config.stations.map((x, i) => (
          <Link key={i} aria-label={"Aller sur la station" + i} className="nav-link" to={"station/"+(i)}>
            <NavCircle key={i}  />
          </Link>
        ))} */}

          <Link  aria-label={"Aller sur la station" + 1} className="nav-link" >
            <Glace style={{ scale: "28%", transform:"translate(-148%, -136%)" }}/>
          </Link>

          <Link aria-label={"Aller sur la station" + 0} className="nav-link" to={"station/"+(0)} >
            <NavCircle />
          </Link>

          <Link  aria-label={"Aller sur la station" + 1} className="nav-link" >
            <Shaker style={{ scale: "28%", transform:"translate(-140%, -146%)" }}/>
          </Link>

      </div>
      <NavUser
        stroke="var(--color-primary)"
        fill="var(--color-background)"
        link={null}
        user={"User"}
      />
    </nav>
  );
}
