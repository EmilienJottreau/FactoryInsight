import { Link, NavLink } from "react-router-dom";

export function LeftMenu({ lastStation, closeMenu }) {
  return (
    <div className="left-menu">
      <NavLink to={"station/" + lastStation} onClick={closeMenu}>
        <div>
          <div>Synoptique</div>
        </div>
      </NavLink>
      <Link to={"historyTable"} onClick={closeMenu}>
        <div>Tables</div>
      </Link>
      <Link to={"historyGraph"} onClick={closeMenu}>
        <div>Graphiques</div>
      </Link>
      <Link to={"stats"} onClick={closeMenu}>
        <div>Statistiques</div>
      </Link>
      <Link to={"docs"} onClick={closeMenu}>
        <div>Documents</div>
      </Link>
      <Link to={"legal"} onClick={closeMenu}>
        <div>Contributeurs</div>
      </Link>
    </div>
  );
}
