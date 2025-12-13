import user from "../Images/user.png";

import { useSelector } from "react-redux";

import Location from "./Location";

const User = () => {
  const email = useSelector((state) => state.users.user.email);
  const name = useSelector((state) => state.users.user.name);

  return (
    <div>
      <img src={user} className="userImage" />
      <br />
      <strong>{name}</strong>
      <br />
      {email}
      <Location />
    </div>
  );
};

export default User;
