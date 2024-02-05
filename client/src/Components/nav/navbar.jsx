import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavUser } from "./navuser";

import { ReactComponent as NavCircle } from "../../assets/img/Nav_Circle.svg";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function NavBar({ toggleMenu, menuVisible }) {
  return (
    <nav className="navbar nav d-flex justify-content-between align-items-center">
      <div className="menuBurger d-flex justify-content-between align-items-center">
        <button className="burgerButton" href="#section" onClick={toggleMenu}>
          <div>
            <FontAwesomeIcon
              icon="fa-solid fa-bars"
              style={
                {
                  // backgroundColor:"red",
                }
              }
            />
          </div>
          <div>Menu</div>
        </button>
      </div>
      <div className="d-flex flex-wrap">
        {[...Array(10)].map((x, i) => (
          <Link className="nav-link" to={"station/"+(i+1)}>
            <NavCircle stroke="var(--color-primary)" />
          </Link>
        ))}

      </div>
      <NavUser
        stroke="var(--color-primary)"
        fill="var(--color-background)"
        link={null}
        user={"Emilien"}
      />
    </nav>
  );
}
