import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function DisplayValue({ value, unit, icon, name }) {
  return (
    <>
      <div className="logo-info">
        <div>{icon && <FontAwesomeIcon icon={icon} />}</div>
        <div>
          <div>{name + " "}</div>
          <div>
            {value !== undefined ? (
              <p>
                {typeof value == "boolean" ? (
                  <span>value</span>
                ) : (
                  <span>{value.toFixed(2) + " " + unit}</span>
                )}
              </p>
            ) : (
              <p className="placeholder-glow">
                <span className="placeholder col-8 placeholder-lg"></span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
