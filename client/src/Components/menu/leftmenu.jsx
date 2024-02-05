import { Link, NavLink } from "react-router-dom";

export function LeftMenu({}) {
  return (
    <div className="left-menu">
      <NavLink to={"station/1"}>
        <button>
          <div>Synoptique</div>
        </button>
      </NavLink>
      <Link to={"historyGraph"}>
        <button>Tables</button>
      </Link>
      <Link to={"historyTable"}>
        <button>Graphiques</button>
      </Link>
      <Link to={"stats"}>
        <button>Statistiques</button>
      </Link>
      <Link>
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
