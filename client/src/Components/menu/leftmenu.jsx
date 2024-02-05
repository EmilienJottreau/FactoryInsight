import { Link, NavLink } from "react-router-dom";

export function LeftMenu({lastStation, closeMenu}) {



  return (
    <div className="left-menu">
      <NavLink to={"station/"+lastStation} onClick={closeMenu}>
        <button>
          <div>Synoptique</div>
        </button>
      </NavLink>
      <Link to={"historyGraph"} onClick={closeMenu}>
        <button>Tables</button>
      </Link>
      <Link to={"historyTable"} onClick={closeMenu}>
        <button>Graphiques</button>
      </Link>
      <Link to={"stats"} onClick={closeMenu}>
        <button>Statistiques</button>
      </Link>
      <Link onClick={closeMenu}>
        <button className="signature">
          Mentions Legales
          {/* <div>Marguerite DIOUF</div>
        <div>Emilien JOTTREAU</div>
        <div>Adrien MICHAUT</div>
      <div>2023</div> */}
        </button>
      </Link>
    </div>
  );
}
