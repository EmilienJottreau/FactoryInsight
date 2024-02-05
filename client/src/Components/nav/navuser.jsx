import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as UserImage } from "../../assets/img/Icon_User.svg";

export function NavUser({ link, user, stroke, fill }) {
  return (
    <div className="navUser">
      <button>
        <FontAwesomeIcon icon="fa-solid fa-palette" />
      </button>
      <a href="link">
        <div>{user}</div>
        <UserImage stroke={stroke} fill={fill} />
      </a>
    </div>
  );
}
