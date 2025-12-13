import React from "react";
import { useSelector } from "react-redux";
const Footer = () => {
  //const cuser = useSelector((state) => state.users.user);
  return (
    <footer className="footer">
      <div>
        © 2025 Health Guide | Powered by AI | Your Health, Our Priority <br />
        By | Abdalaziz | Hamed | Asama
      </div>
    </footer>
  );
};

export default Footer;
