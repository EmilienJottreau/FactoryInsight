import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavUser } from "./navuser";

import { ReactComponent as NavCircle } from "../../assets/img/Nav_Circle.svg";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import config from "../configuration.json";
import { MenuBurger } from "../base/MenuBurger";

export function NavBar({ toggleMenu, menuVisible }) {
  return (
    <nav className="navbar nav d-flex justify-content-between align-items-center">
      <MenuBurger toggleMenu={toggleMenu}/>
      <div className="d-flex flex-wrap">
        {config.stations.map((x, i) => (
          <Link key={i} aria-label={"Aller sur la station" + i} className="nav-link" to={"station/"+(i)}>
            <NavCircle key={i} stroke="var(--color-primary)" />
          </Link>
        ))}

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
