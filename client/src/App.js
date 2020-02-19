import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import DeleteUserDialog from "./DeleteUserDialog";
import EditUserDialog from "./EditUserDialog";

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
      department: department || null
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
          <>
            <TextField
              id="outlined-password"
              name="passwordVerify"
              type="password"
              label="Verify Password"
              value={passwordVerify}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              required
            />
            <FormControl variant="outlined">
              <InputLabel
                // ref={inputLabel}
                id="demo-simple-select-outlined-label"
              >
                Department
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={department}
                onChange={handleChange}
                name="department"
                defaultValue="student"
                autoWidth
                margin="dense"
              >
                <MenuItem value={"student"}>Student</MenuItem>
                <MenuItem value={"faculty"}>Faculty</MenuItem>
                <MenuItem value={"admin"}>Admin</MenuItem>
              </Select>
            </FormControl>
          </>
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
      {!!userList &&
        userList.map(user => {
          return (
            <div
              key={user.id}
              style={{
                padding: "10px",
                border: "2px solid blue",
                marginBottom: "10px",
                borderRadius: "4px"
              }}
            >
              <p>id: {user.id}</p>
              <p>username: {user.username}</p>
              <p>department: {user.department}</p>
              {currentId === user.id && (
                <>
                  <EditUserDialog user={user} refresh={refresh} />
                  <DeleteUserDialog
                    id={user.id}
                    refresh={refresh}
                    logout={tryLogout}
                  />
                </>
              )}
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
