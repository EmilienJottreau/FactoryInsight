import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export function DisplayValue({ value, config }) {
  return (
    <>
      <Link to={"/historyGraph?tag="+config.name}>
        <div className="logo-info"
          style={config.hue && {
            backgroundColor: "hsl(0 61% 67% / 1)",
            filter: "hue-rotate(" + config.hue + ")",
          }}
        >
          <div>{config.icon && <FontAwesomeIcon icon={config.icon} />}</div>
          <div>
            <div>{config.frendlyName + " "}</div>
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
                    <span>{value.toFixed(config.digit) + " " + config.unit}</span>
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
