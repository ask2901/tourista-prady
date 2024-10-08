import React, { useState, useContext, useEffect } from "react";
import GoogleLogin from "react-google-login";
import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";
import { useAuth0 } from "@auth0/auth0-react";

const Login = (props) => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { login, error, clearErrors, isAuthenticated } = useAuth0();
  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/dashboard");
    }

    if (error === "Invalid Credentials") {
      alertContext.setAlert("Invalid Credententials", "danger");
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const { loginWithRedirect } = useAuth0();
  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
    } else {
      loginWithRedirect();
    }
  };

  const onLoginSuccess = (res) => {
    login({
      email: res.profileObj.email,
      password: "GooglePassword",
    });
  };

  const onLoginFailure = (res) => {
    console.log("Login Failed:", res);
  };

  const LoginForm = {
    maxWidth: "500px",
    padding: "15px",
    margin: "auto",
    marginTop: "50px",
  };

  var axios = require("axios").default;
  var options = {
    method: "GET",
    url: "https://your-auth0-tenant.com/api/v2/connections",
    headers: { authorization: "Bearer {yourAccessToken}" },
  };
  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });

  return (
    <div style={LoginForm}>
      <h1 style={{ textAlign: "center" }}>
        Account <span className="text-primary">Login</span>
      </h1>
      <button type="submit" className="btn btn-primary mt-3" value="Register" onClick={() => loginWithRedirect()}>
        Login
      </button>
      <GoogleLogin clientId="" buttonText="Log In with Google" onSuccess={onLoginSuccess} onFailure={onLoginFailure} cookiePolicy={"single_host_origin"} className="mt-3" />
    </div>
  );
};

export default Login;
