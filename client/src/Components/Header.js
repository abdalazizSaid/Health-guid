import { Navbar, NavbarBrand, Nav, NavItem, Button } from "reactstrap";
import { Link, NavLink as RouterNavLink } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../Features/UserSlice";

const Header = () => {
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } finally {
      navigate("/login");
    }
  };

  const baseLinkClass = ({ isActive }) =>
    "nav-link header-link" + (isActive ? " active" : "");

  const renderLoggedOutNav = () => (
    <>
      <NavItem>
        <RouterNavLink to="/" className={baseLinkClass}>
          Home
        </RouterNavLink>
      </NavItem>

      <NavItem>
        <RouterNavLink to="/symptom-checker" className={baseLinkClass}>
          Symptom Checker
        </RouterNavLink>
      </NavItem>

      <NavItem className="mx-2">
        <RouterNavLink to="/login" className={baseLinkClass}>
          Login
        </RouterNavLink>
      </NavItem>

      <NavItem>
        <Button
          color="primary"
          className="header-btn-signup"
          tag={Link}
          to="/register"
        >
          Sign Up
        </Button>
      </NavItem>
    </>
  );

  const renderPatientNav = () => (
    <>
      <NavItem>
        <RouterNavLink to="/" className={baseLinkClass}>
          Home
        </RouterNavLink>
      </NavItem>

      <NavItem>
        <RouterNavLink to="/symptom-checker" className={baseLinkClass}>
          Symptom Checker
        </RouterNavLink>
      </NavItem>

      <NavItem>
        <RouterNavLink to="/appointments" className={baseLinkClass}>
          Appointments
        </RouterNavLink>
      </NavItem>

      <NavItem className="mx-2">
        <RouterNavLink to="/patient/profile" className={baseLinkClass}>
          My Profile
        </RouterNavLink>
      </NavItem>

      <span className="me-3 header-user-name">Hi {user?.name || "Guest"}</span>

      <Button
        color="light"
        className="btn-outline-primary header-btn-login"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );

  const renderDoctorNav = () => (
    <>
      <NavItem>
        <RouterNavLink to="/doctor/appoin" className={baseLinkClass}>
          Appointments
        </RouterNavLink>
      </NavItem>

      <NavItem className="mx-2">
        <RouterNavLink to="/doctor/profile" className={baseLinkClass}>
          My Profile
        </RouterNavLink>
      </NavItem>

      <span className="me-3 header-user-name">
        {user?.name ? `Dr ${user.name}` : "Doctor"}
      </span>

      <Button
        color="light"
        className="btn-outline-primary header-btn-login"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );

  const renderAdminNav = () => (
    <>
      <span className="me-3 header-user-name">
        {user?.name || "System Admin"}
      </span>
      <Button
        color="light"
        className="btn-outline-primary header-btn-login"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );

  const renderNavForUser = () => {
    if (!user || !user.email) return renderLoggedOutNav();

    if (user.role === "admin") return renderAdminNav();
    if (user.role === "doctor") return renderDoctorNav();

    return renderPatientNav();
  };

  return (
    <Navbar color="light" light expand="md" className="health-header shadow-sm">
      <div className="header-inner">
        <NavbarBrand tag={Link} to="/" className="d-flex align-items-center">
          <div className="logo-circle">
            <span className="logo-icon">🩺</span>
          </div>
          <span className="logo-text">Health Guide</span>
        </NavbarBrand>

        <Nav className="ms-auto align-items-center" navbar>
          {renderNavForUser()}
        </Nav>
      </div>
    </Navbar>
  );
};

export default Header;
