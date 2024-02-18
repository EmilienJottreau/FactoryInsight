import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavUser } from "./navuser";

import { ReactComponent as NavCircle } from "../../assets/img/Nav_Circle.svg";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import config from "../configuration.json";
import { MenuBurger } from "../base/MenuBurger";

import { ReactComponent as Mixer } from "../../assets/img/Mixer.svg"
import { ReactComponent as Shaker } from "../../assets/img/Shaker.svg"

export function NavBar({ toggleMenu, menuVisible }) {
  return (
    <nav className="navbar">
      <MenuBurger toggleMenu={toggleMenu}/>
      <div className="d-flex flex-wrap">
        {/* {config.stations.map((x, i) => (
          <Link key={i} aria-label={"Aller sur la station" + i} className="nav-link" to={"station/"+(i)}>
            <NavCircle key={i}  />
          </Link>
        ))} */}

          <Link  aria-label={"Aller sur la station" + 1} className="nav-link" >
            <Mixer style={{ scale: "28%", transform:"translateY(-144%)" }}/>
          </Link>

          <Link aria-label={"Aller sur la station" + 0} className="nav-link" to={"station/"+(0)} >
            <NavCircle />
          </Link>

          <Link  aria-label={"Aller sur la station" + 1} className="nav-link" >
            <Shaker style={{ scale: "28%", transform:"translateY(-144%)" }}/>
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
