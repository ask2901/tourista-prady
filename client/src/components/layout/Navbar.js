import React, { Fragment, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = ({ title, icon }) => {
  const authContext = useContext(AuthContext);

  const { isAuthenticated, logout, user } = useAuth0();
  console.log(user);

  // useEffect(() => {
  //   loadUser();
  //   // eslint-disable-next-line
  // }, []);

  // const onLogout = () => {
  //   logout();
  // };

  const authLinks = (
    <Fragment>
      <li className="nav-link" style={{ color: "black", fontWeight: "600" }}>
        Hello {user && user.name}
      </li>
      <li>
        <Link
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          to="#!"
          className="nav-link">
          <i className="fas fa-sign-out-alt" />{" "}
          <span
            className="hide-sm"
            style={{ color: "black", fontWeight: "600" }}>
            Logout
          </span>
        </Link>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link to="/register" className="nav-link">
          Register
        </Link>
      </li>
      <li>
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </li>
    </Fragment>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link style={{ marginLeft: "50px" }} className="navbar-brand" to="/">
            <i className={icon} /> {title}
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            style={{ marginRight: "50px" }}
            id="navbarSupportedContent">
            <ul className="navbar-nav ">
              {isAuthenticated ? authLinks : guestLinks}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

Navbar.defaultProps = {
  title: "Travelo",
  icon: "fas fa-id-card-alt",
};

export default Navbar;
