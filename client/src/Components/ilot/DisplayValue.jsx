import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export function DisplayValue({ value, config }) {
  return (
    <>
      <Link to={"/historyGraph?tag="+config.name}>
        <div className="logo-info">
          <div>{config.icon && <FontAwesomeIcon icon={config.icon} />}</div>
          <div>
            <div>{config.name + " "}</div>
            <div>
              {value !== undefined ? (
                <p>
                  {typeof value == "boolean" ? (
                    value ? (
                      <span>{config.state_on}</span>
                    ) : (
                      <span>{config.state_off}</span>
                    )
                  ) : (
                    <span>{value.toFixed(2) + " " + config.unit}</span>
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
      </Link>
    </>
  );
}
