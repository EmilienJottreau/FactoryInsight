import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function MenuBurger({ toggleMenu }) {
  return (
    <>
      <div className="menuBurger d-flex justify-content-between align-items-center">
        <button className="burgerButton" href="#section" onClick={toggleMenu}>
          <div>
            <FontAwesomeIcon icon="fa-solid fa-bars" />
          </div>
          <div>Menu</div>
        </button>
      </div>
    </>
  );
}
