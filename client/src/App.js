import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [userList, setUserList] = useState([]);
  const [isSignup, setIsSignup] = useState(false);
  const [passwordVerify, setPasswordVerify] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = event => {
    const { name, value } = event.target;
    name === "username" && setUsername(value);
    name === "password" && setPassword(value);
    name === "passwordVerify" && setPasswordVerify(value);
  };

  const trySignup = async event => {
    event.preventDefault();
    const info = event.target;
    const tempErrors = [];
    const user = {
      username: info[0].value,
      password: info[1].value,
      passwordVerify: info[2].value
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
            password: user.password
          })
          .then(res => res.data);
        console.log(newUser);
        tryLogin(newUser);
      } catch (err) {
        // console.warn(err.message);
        setErrors(["username not available"]);
      }
    }
  };
  const tryLogin = async (obj, target) => {
    const tempErrors = [];
    const user = {
      username: obj && obj.username ? username : target[0].value,
      password: obj && obj.password ? password : target[1].value
    };
    if (!user.username) tempErrors.push("username required");
    if (!user.password) tempErrors.push("password required");
    if (tempErrors.length > 0) setErrors([...new Set(tempErrors)]);
    else {
      try {
        const tok = await axios
          .post("http://localhost:5000/api/login", user)
          .then(res => res.data.token);
        setToken(tok);
        localStorage.setItem("token", tok);
        setUserList(
          await axios({
            method: "get",
            url: "http://localhost:5000/api/users",
            headers: { Authorization: tok }
          }).then(res => res.data)
        );
        setIsLoggedIn(true);
        setErrors([]);
      } catch (err) {
        // console.warn(err.message);
        setErrors(["invalid credentials"]);
      }
    }
  };
  const tryLogout = () => {
    localStorage.clear();
    setUserList([]);
    setUsername("");
    setPassword("");
    setIsSignup(false);
    setIsLoggedIn(false);
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
        className={isLoggedIn ? "hide" : null}
        onSubmit={
          isSignup
            ? trySignup
            : e => {
                e.preventDefault();
                tryLogin(null, e.target);
              }
        }
        style={{ marginBottom: "10px" }}
      >
        <input
          type="text"
          placeholder="username"
          name="username"
          value={username}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        {isSignup && (
          <input
            type="password"
            placeholder="verify password"
            name="passwordVerify"
            value={passwordVerify}
            onChange={handleChange}
          />
        )}
        <button>{isSignup ? "Sign up" : "Log in"}</button>
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
      {!!userList &&
        userList.map(user => {
          return (
            <div
              key={user.id}
              style={{
                padding: "10px",
                border: "2px solid blue",
                marginBottom: "10px"
              }}
            >
              <p>id: {user.id}</p>
              <p>username: {user.username}</p>
              <p>department: {user.department}</p>
            </div>
          );
        })}
      <div
        className={!isLoggedIn ? "hide" : null}
        onClick={tryLogout}
        style={{
          padding: "5px",
          border: "1px solid black",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Log out
      </div>
    </div>
  );
}

export default App;
