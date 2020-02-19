import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import UserList from "./UserList";
import SignupAdditions from "./SignupAdditions";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [userList, setUserList] = useState([]);
  const [isSignup, setIsSignup] = useState(false);
  const [passwordVerify, setPasswordVerify] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const handleChange = event => {
    const { name, value } = event.target;
    name === "username" && setUsername(value);
    name === "password" && setPassword(value);
    name === "passwordVerify" && setPasswordVerify(value);
    name === "department" && setDepartment(value);
  };

  useEffect(() => {
    if (isLoggedIn) updateUserList();
    // eslint-disable-next-line
  }, [forceUpdate]);

  const login = async user => {
    try {
      const userData = await axios
        .post("http://localhost:5000/api/login", user)
        .then(res => res.data);
      setCurrentId(userData.id);
      localStorage.setItem("token", userData.token);
      updateUserList();
      setIsLoggedIn(true);
      setErrors([]);
    } catch (err) {
      setErrors(["invalid credentials"]);
    }
  };

  const updateUserList = async () => {
    setUserList(
      await axios({
        method: "get",
        url: "http://localhost:5000/api/users",
        headers: { Authorization: localStorage.getItem("token") }
      }).then(res => res.data)
    );
  };

  const trySignup = async event => {
    event.preventDefault();
    const tempErrors = [];
    const user = {
      username: username,
      password: password,
      passwordVerify: passwordVerify,
      department: department || "student"
    };

    if (!user.username) tempErrors.push("username required");
    if (!user.password) tempErrors.push("password required");
    if (user.password !== user.passwordVerify)
      tempErrors.push("passwords do not match");
    if (tempErrors.length > 0) setErrors([...new Set(tempErrors)]);
    else {
      try {
        const newUser = await axios
          .post("http://localhost:5000/api/register", {
            username: user.username,
            password: user.password,
            department: user.department
          })
          .then(res => res.data);
        tryLogin(newUser);
      } catch (err) {
        // console.warn(err.message);
        setErrors(["username not available"]);
      }
    }
  };
  const tryLogin = async obj => {
    const tempErrors = [];
    const user = {
      username: obj && obj.username ? username : username,
      password: obj && obj.password ? password : password
    };
    if (!user.username) tempErrors.push("username required");
    if (!user.password) tempErrors.push("password required");
    if (tempErrors.length > 0) setErrors([...new Set(tempErrors)]);
    else {
      login(user);
    }
  };
  const tryLogout = () => {
    localStorage.clear();
    setUserList([]);
    setUsername("");
    setPassword("");
    setPasswordVerify("");
    setDepartment("");
    setIsSignup(false);
    setIsLoggedIn(false);
  };

  const refresh = () => {
    setForceUpdate(!forceUpdate);
  };

  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>{isLoggedIn ? "User List" : isSignup ? "Register" : "Login"}</h1>
      {errors &&
        errors.map((error, id) => (
          <p style={{ color: "red" }} key={id}>
            {error}
          </p>
        ))}
      <form
        className={isLoggedIn ? "hide" : "form-container"}
        onSubmit={
          isSignup
            ? trySignup
            : e => {
                e.preventDefault();
                tryLogin();
              }
        }
      >
        <TextField
          id="outlined-name"
          name="username"
          label="Name"
          value={username}
          onChange={handleChange}
          margin="dense"
          variant="outlined"
          required
        />

        <TextField
          id="outlined-password"
          name="password"
          type="password"
          label="Password"
          value={password}
          onChange={handleChange}
          margin="dense"
          variant="outlined"
          required
        />

        {isSignup && (
          <SignupAdditions
            handleChange={handleChange}
            password={passwordVerify}
            department={department}
          />
        )}
        <Button variant="outlined" type="submit" color="primary">
          {isSignup ? "Sign up" : "Log in"}
        </Button>
        <div
          className={isLoggedIn ? "hide" : null}
          onClick={() => {
            setIsSignup(!isSignup);
            setErrors([]);
          }}
          style={{ cursor: "pointer", color: "purple" }}
        >
          {isSignup ? "Have an account? log in instead" : "Sign up instead"}
        </div>
      </form>
      <UserList
        userList={userList}
        refresh={refresh}
        currentId={currentId}
        tryLogout={tryLogout}
      />
      {isLoggedIn && (
        <Button variant="outlined" onClick={tryLogout}>
          Log Out
        </Button>
      )}
    </div>
  );
}

export default App;
