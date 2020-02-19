import React, { useState, useEffect } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";

import SelectDepartment from "./SelectDepartment";

const EditUserDialog = ({ user, refresh }) => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState([]);
  const [editUser, setEditUser] = useState({
    username: user.username,
    password: "",
    passwordVerify: "",
    department: user.department
  });
  const [editChoices, SetEditChoices] = useState({
    username: false,
    password: false,
    department: false
  });

  useEffect(() => {
    resetData();
  }, []);

  const resetData = () => {
    setEditUser({
      username: user.username,
      password: "",
      passwordVerify: "",
      department: user.department
    });
    SetEditChoices({
      username: false,
      password: false,
      department: false
    });
    setErrors([]);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, type) => {
    if (type === "user") {
      console.log(event.target);
      const { name, value } = event.target;
      setEditUser({ ...editUser, [name]: value });
    }
    if (type === "choices") {
      const { value, checked } = event.target;
      SetEditChoices({ ...editChoices, [value]: checked });
    }
  };

  const handleSave = async () => {
    if (editUser.password === editUser.passwordVerify) {
      const omitPass = {
        username: editUser.username,
        department: editUser.department || "student"
      };
      try {
        await axios.put(
          `http://localhost:5000/api/users/${user.id}`,
          editUser.password ? editUser : omitPass,
          {
            headers: { Authorization: localStorage.getItem("token") }
          }
        );
        resetData();
        handleClose();
        refresh();
      } catch (err) {
        console.log(err.message);
      }
    } else {
      setErrors([...new Set([...errors, "Passwords do not match"])]);
    }
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Edit User
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
        <DialogContent>
          {errors &&
            errors.map((err, id) => (
              <div key={id}>
                <p style={{ color: "red" }}>{err}</p>
              </div>
            ))}

          {editChoices.username && (
            <TextField
              margin="dense"
              id="name"
              label="Name"
              type="text"
              onChange={e => handleChange(e, "user")}
              value={editUser.username}
              name="username"
              fullWidth
            />
          )}
          {editChoices.password && (
            <>
              <TextField
                margin="dense"
                id="password"
                label="New Password"
                type="password"
                onChange={e => handleChange(e, "user")}
                value={editUser.password}
                name="password"
                fullWidth
              />
              <TextField
                margin="dense"
                id="passwordVerify"
                label="Verify New Password"
                type="password"
                onChange={e => handleChange(e, "user")}
                value={editUser.passwordVerify}
                name="passwordVerify"
                fullWidth
              />
            </>
          )}
          {editChoices.department && (
            <SelectDepartment
              handleChange={e => handleChange(e, "user")}
              department={editUser.department}
            />
          )}
          <FormControl component="fieldset">
            <FormLabel component="legend">What do you want to edit?</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editChoices.username}
                    onChange={e => handleChange(e, "choices")}
                    value="username"
                  />
                }
                label="Username"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editChoices.password}
                    onChange={e => handleChange(e, "choices")}
                    value="password"
                  />
                }
                label="Password"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editChoices.department}
                    onChange={e => handleChange(e, "choices")}
                    value="department"
                  />
                }
                label="Department"
              />
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditUserDialog;
